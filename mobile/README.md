# Saqueganador — Mobile (Expo)

React Native / Expo port of the Saqueganador tennis-fantasy website (`../website`, Angular).
It talks to the same AWS Lambda backend and Cognito user pool, so it shares live data with the web app.

## Stack

- **Expo SDK 54** + **expo-router** (file-based routing)
- **TypeScript**
- **aws-amplify v6** for Cognito auth (email login, sign-up with `preferred_username`)
- Backend: the same AWS Lambda function URLs as the website (see `src/config/env.ts`)

## Running

```bash
cd mobile
npm install
npm start        # Expo dev server — press i / a / w for iOS, Android, web
```

If your global npm cache has permission issues, install with an alternate cache:
`npm install --cache /tmp/npm-cache-sg`.

## Feature parity with the website

| Website route      | Mobile screen            | Notes |
|--------------------|--------------------------|-------|
| `/welcome`         | `app/welcome.tsx`        | Tournament banner, past winners, Champions Race |
| `/ranking`         | `app/ranking.tsx`        | Ranking table, filter by round |
| `/teams`           | `app/teams/index.tsx`    | View any user's team per round |
| `/teams/:id`       | `app/teams/[id].tsx`     | Deep-link to a user's team |
| `/bet`             | `app/bet.tsx`            | Build team: pick players, multipliers, reorder |
| `/tutorial`        | `app/tutorial.tsx`       | Rules ("Cómo jugar") |
| `/login`           | `app/login.tsx`          | Cognito sign in / sign up / confirm |
| `/admin`           | `app/admin.tsx`          | Match results (admins only) |
| `/root`            | `app/root.tsx`           | Advance rounds, lucky losers (root only) |

## Layout

- `app/` — expo-router routes; `app/_layout.tsx` wraps everything in the auth + tournament
  providers and the shared top `NavBar`.
- `src/api/api.ts` — fetch-based client for the Lambda endpoints (ports the Angular services).
- `src/types/model.ts` — domain model (ported from `website/src/app/shared/model.ts`).
- `src/components/team/` — the betting engine: selected players, available players, multipliers,
  and `teamLogic.ts` (scoring / multiplier / reorder rules ported from `team.component.ts`).
- `src/config/env.ts` — Lambda URLs and Cognito pool config.

## Notes / differences from the web app

- HTML `<select>` is replaced by a modal-based `Select` component; ng-bootstrap confirmation
  modals are replaced by the native `Alert.alert` dialog.
- The admin match start-time uses a plain text field (`YYYY-MM-DD HH:mm`) instead of a
  browser `datetime-local` input.
