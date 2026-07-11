# SaqueGanador Lambda functions

Backend AWS Lambda functions (account `687400810619`, region `us-east-1`,
runtime `nodejs22.x`). Each `saqueganador-*/` directory is one function; its
entry point is `index.mjs` (handler `index.handler`).

## Shared code

Code used by more than one function lives once in [`shared/`](shared/):

| File | What it is |
| --- | --- |
| `shared/auth.mjs` | Cognito JWT verification (`requireUser`, `requireAdmin`) for the public Function URLs. |
| `shared/repository.mjs` | DynamoDB data access — the union of every function's data-layer helpers. |
| `shared/keyManager.mjs` | Key-building helpers (`getStem`, `getTeamKey`, …). |

Functions import from it with a relative path, e.g.:

```js
import { requireAdmin } from '../shared/auth.mjs';
import { getTournament, saveTeam } from '../shared/repository.mjs';
```

These files were previously copied into each function directory (auth ×4,
keyManager ×7, repository ×10). They are now single-sourced — fix a bug once and
redeploy, rather than editing every copy.

## Deploying

Because functions import from `../shared`, they **cannot** be deployed as raw
`.mjs` files — that directory isn't inside the function's zip. Instead,
[`deploy.sh`](deploy.sh) uses esbuild to bundle each `index.mjs` together with its
`shared/` imports into one self-contained `index.mjs`, then zips and uploads it.
The AWS SDK (`@aws-sdk/*`) and Node built-ins stay external (provided by the
runtime), so they are not bundled.

```bash
cd lambdas
./deploy.sh saqueganador-list-teams                 # bundle + deploy one
./deploy.sh saqueganador-list-teams saqueganador-start-round   # several
./deploy.sh --dry saqueganador-list-teams           # bundle only, no upload (verify)
```

`--dry` is the way to verify a change compiles and all imports resolve without
touching AWS. esbuild fails the build if any imported name is missing.

11 of the 21 functions currently use `shared/` and go through this script. The
rest (the Cognito auth-challenge triggers, `list-players`, `list-users`,
`list-tournaments`, `ranking`, `race`, `auth-bridge`, `new-tournament`) are
standalone and can still be deployed by zipping their own files.

esbuild is resolved from `../website/node_modules/.bin/esbuild` (already present
in the repo); if that's gone, the script falls back to `npx esbuild`.

## Configuration notes

- The four write/admin functions (`list-teams`, `start-round`,
  `move-game-to-next-round`, `add-lucky-loser`) require the env var
  `USER_POOL_ID` (Cognito user pool `us-east-1_1zv8qzlMB`) and enforce auth in the
  handler. Their Function URL CORS allows the `authorization` header.
- See [`../SECURITY.md`](../SECURITY.md) for the security posture and open items.
