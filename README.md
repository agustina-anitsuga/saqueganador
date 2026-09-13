# Saqueganador

Saqueganador es un juego de fantasy tenis: por cada torneo (Grand Slam u
otro), los usuarios arman un equipo de jugadores del cuadro y suman puntos
según cómo les va en cada ronda real del torneo. Hay un ranking por ronda,
por torneo y global, y funcionalidades propias del género (lucky loser,
"race" hacia la próxima ronda, etc).

## Estructura del repo

Monorepo con cuatro partes independientes:

| Carpeta | Qué es | Stack |
| --- | --- | --- |
| [`website/`](website) | Aplicación web (donde se juega) | Angular 15, AWS Amplify / Cognito |
| [`mobile/`](mobile) | App mobile (iOS/Android) | Expo / React Native |
| [`lambdas/`](lambdas) | Backend: una función Lambda por caso de uso (listar torneos, guardar equipo, actualizar ranking, etc.), expuestas como Function URLs y con DynamoDB como base de datos | Node.js (`nodejs22.x`), AWS Lambda, DynamoDB, Cognito |
| [`scraper/`](scraper) | Scraper que trae rankings y datos de jugadores de ATP/WTA (vía ESPN) para alimentar el juego | Java / Maven |

Documentación adicional del proyecto (decisiones de arquitectura, patrones
de acceso a datos, planes de cambios) vive en [`documentation/`](documentation).

## Autenticación

El login es con AWS Cognito. Al confirmarse un usuario nuevo, un trigger
(`saqueganador-auth-bridge`) lo da de alta en la tabla `SaqueGanador-Users` y
le crea automáticamente un equipo vacío para la ronda activa del torneo en
curso.