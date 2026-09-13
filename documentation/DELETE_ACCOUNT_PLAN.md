# Plan: borrar también los datos de DynamoDB al eliminar la cuenta

## Problema actual

`deleteAccount()` en [website/src/app/auth/auth.service.ts:45](../website/src/app/auth/auth.service.ts#L45)
solo llama a `Auth.deleteUser()` (Amplify), que borra al usuario de Cognito.
Nunca se toca DynamoDB, así que después de "borrar la cuenta" quedan
registros huérfanos con datos personales (`userName`) en:

- `SaqueGanador-Users` — el registro del usuario (creado por el trigger
  `PostConfirmation` en [saqueganador-auth-bridge](../lambdas/saqueganador-auth-bridge/index.mjs)).
- `SaqueGanador-Teams` — un item por torneo/ronda, cada uno con `user: {...}`
  embebido completo (ver `createTeam` en auth-bridge).
- `SaqueGanador-Race` — items con `raceId` prefijado por `userId`
  (`getRaceItemsForUser` en [shared/repository.mjs:223](../lambdas/shared/repository.mjs#L223)).
- `SaqueGanador-Ranking` — también embebe `user: pUser` por ronda/torneo/global
  (ver `saqueganador-ranking-update/index.mjs`).

## Decisión a tomar antes de implementar

Borrar en cascada `Teams`/`Race`/`Ranking` puede romper la integridad del
ranking/competencia (huecos en el draw, posiciones que desaparecen a mitad de
torneo). Dos caminos:

- **Opción A — hard delete completo** (más simple, cumple "derecho al
  olvido" a rajatabla): borrar el registro en las 4 tablas para ese
  `userId`.
- **Opción B — borrar `Users` + anonimizar el resto** (recomendada si el
  torneo está en curso): borrar `SaqueGanador-Users`, pero en `Teams` /
  `Race` / `Ranking` reemplazar `user.userName` por algo como
  `"Usuario eliminado"` en vez de borrar el item, preservando puntajes y
  posiciones.

Este plan asume **Opción A** (alcance mínimo: `Users` + `Teams`, que es lo
que el usuario ve como "su cuenta"). Si se quiere anonimizar en vez de
borrar, o incluir `Race`/`Ranking`, es un cambio de una función en el paso 2.

## Pasos

### 1. `shared/repository.mjs` — agregar funciones de borrado

No existe ninguna función `delete*` hoy. Agregar (mismo estilo que
`getUsers`/`getTeams` existentes):

```js
export const deleteUser = async (userId) => {
    await documentClient.delete({
        TableName: 'SaqueGanador-Users',
        Key: { userId },
    });
};

export const deleteTeam = async (teamId) => {
    await documentClient.delete({
        TableName: 'SaqueGanador-Teams',
        Key: { teamId },
    });
};
```

Y una forma de encontrar los teams de un usuario. `getTeams()` ya trae todos
los items — filtrar client-side por `team.user.userId === userId` (el mismo
patrón que `teamsContainingPlayer` en `saqueganador-add-lucky-loser`).

### 2. Nuevo lambda `saqueganador-delete-account`

Un lambda dedicado (no reusar `saqueganador-list-users`: ese endpoint hoy es
público, sin auth, y solo hace `scan` para el admin — mezclar ahí un DELETE
de auto-servicio es peligroso). Estructura, calcada de
[saqueganador-add-lucky-loser/index.mjs](../lambdas/saqueganador-add-lucky-loser/index.mjs):

```js
import { getTeams, deleteUser, deleteTeam } from '../shared/repository.mjs';
import { requireUser } from '../shared/auth.mjs';

export const handler = async (event) => {
    let statusCode = '200';
    let body;
    const headers = { 'Content-Type': 'application/json' };

    try {
        switch (event.requestContext.http.method) {
            case 'DELETE': {
                const userId = await requireUser(event); // del propio JWT, no del body
                const teams = await getTeams();
                for (const team of teams) {
                    if (team.user && team.user.userId === userId) {
                        await deleteTeam(team.teamId);
                    }
                }
                await deleteUser(userId);
                break;
            }
            default:
                throw Object.assign(new Error('Unsupported method'), { statusCode: 405 });
        }
    } catch (err) {
        statusCode = err.statusCode ? String(err.statusCode) : '500';
        body = err.message || String(err);
    } finally {
        body = JSON.stringify(body);
    }

    return { statusCode, body, headers };
};
```

Punto clave de seguridad: `userId` sale de `requireUser(event)` (el `sub`
verificado del JWT), **nunca** del body — así un usuario solo puede borrarse
a sí mismo, igual que el resto de los endpoints autenticados.

### 3. Infraestructura (fuera del repo, manual)

- Crear la función Lambda `saqueganador-delete-account` en AWS (runtime
  `nodejs22.x`), igual que las demás.
- Function URL con `AuthType: NONE` (la auth la hace el propio handler vía
  `requireToken`, mismo patrón que el resto).
- Variable de entorno `USER_POOL_ID` (y `APP_CLIENT_ID` si se usa en otros
  lambdas).
- Rol de ejecución con permisos `dynamodb:Scan` + `dynamodb:DeleteItem` sobre
  `SaqueGanador-Teams` y `dynamodb:DeleteItem` sobre `SaqueGanador-Users`.
- Deploy con lo ya existente: `./deploy.sh saqueganador-delete-account`.

### 4. Frontend

`website/src/environments/environment.ts` y `environment.prod.ts` — agregar:

```ts
deleteAccountUrl: 'https://<nueva-function-url>.lambda-url.us-east-1.on.aws/',
```

`website/src/app/auth/auth.service.ts` — el orden importa: hay que borrar el
registro de DynamoDB **antes** de borrar el usuario de Cognito, porque el
endpoint necesita un JWT válido para autenticarse, y `Auth.deleteUser()`
cierra la sesión:

```ts
async deleteAccount() {
    const headers = await authHeaders(); // igual que en team.component.ts
    const res = await fetch(this.environment.deleteAccountUrl, {
        method: 'DELETE',
        headers: { Authorization: headers.get('Authorization')! },
    });
    if (!res.ok) {
        throw new Error('No se pudo borrar los datos de la cuenta');
    }
    await Auth.deleteUser();
    localStorage.removeItem('user');
    this.authenticator.signOut();
    this.router.navigate(['/welcome']);
}
```

Si falla el borrado en DynamoDB, se corta ahí y no se borra el usuario de
Cognito (falla cerrado: mejor tener la cuenta intacta y reintentar que dejar
datos huérfanos sin dueño).

### 5. Testing manual

1. Crear un usuario de prueba, confirmar que aparece en `SaqueGanador-Users`
   y que tiene un team en `SaqueGanador-Teams` (via `saqueganador-list-users`
   / consola de DynamoDB).
2. Ejecutar el flujo de borrado de cuenta desde la UI.
3. Verificar en la consola de Cognito que el usuario ya no existe.
4. Verificar en DynamoDB que el item de `SaqueGanador-Users` y sus
   `SaqueGanador-Teams` desaparecieron.
5. Probar el caso de error: cortar la red antes del `fetch` y confirmar que
   Cognito NO borra al usuario (fail closed).

## Fuera de alcance (a decidir después)

- Limpieza de `SaqueGanador-Race` y `SaqueGanador-Ranking` (Opción A vs B
  arriba).
- Borrado de fotos de perfil si se suben a S3 en algún momento (hoy no vi
  ese flujo).
