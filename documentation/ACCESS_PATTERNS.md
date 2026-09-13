# DynamoDB access-pattern inventory

Every read the Lambda handlers perform, and the index design that would replace
the full-table scans with efficient queries. This is a **plan**, not applied —
implement when scale warrants (see SECURITY.md item 5).

## Table keys (current)

| Table | Partition key | Key format |
| --- | --- | --- |
| `SaqueGanador-Teams` | `teamId` | `{tournamentId}-{roundId}-{userId}` |
| `SaqueGanador-Matches` | `matchId` | `{tournamentId}-{roundId}-{bracket…}` |
| `SaqueGanador-Ranking` | `rankingId` | global: `{tid}--{userId}` · per-round: `{tid}-{roundId}-{userId}` |
| `SaqueGanador-Race` | `raceId` | `race-a-…` · `race-d-…` · `{userId}-…` |
| `SaqueGanador-Users` | `userId` | Cognito sub |
| `SaqueGanador-Players` | `playerId` | slug |
| `SaqueGanador-Tournaments` | `tournamentId` | single active row |

## A. Reads that are already fine (no change)

**Point reads** (get by primary key — optimal):

| Function | Table | Read |
| --- | --- | --- |
| `getMatch` | Matches | `get {matchId}` |
| `getPlayer` | Players | `get {playerId}` |
| `getTeam` | Teams | `get {teamId}` |
| `getRanking` | Ranking | `get {rankingId}` |
| `getUser` (auth-bridge) | Users | `get {userId}` |

**Intentional "list everything" scans** (you genuinely want the whole table;
a scan is the right tool — just note they grow over time):

| Function / handler | Table | Note |
| --- | --- | --- |
| `getTournament`, `list-tournaments`, auth-bridge | Tournaments | 1 row — negligible |
| `getUsers`, `list-users` | Users | all users |
| `getTeams`, `list-teams` `GET /` | Teams | all teams |
| `list-ranking` (`ranking`) | Ranking | full leaderboard |
| `getMatches`, `list-matches` `GET /` | Matches | all matches |
| `race` | Race | all race rows |

## B. Reads that should become queries (scan → Query via GSI)

These read the **whole table** to return a **subset** — the pattern to fix.

| Function (handler) | Table | Currently | Wants | GSI |
| --- | --- | --- | --- | --- |
| `list-teams` `GET /{userId}` | Teams | scan + JS filter `user.userId` | one user's teams | **Teams-by-user** |
| `getTeamsInRound` (update-match-score) | Teams | ScanFilter `teamId BEGINS_WITH {tid}-{roundId}-` | one round's teams | **Teams-by-round** |
| `getImpactedTeams` (update-match-score) | Teams | ScanFilter `teamId BEGINS_WITH {tid}-{roundId}-` | one round's teams | **Teams-by-round** |
| `list-players` | Matches | scan + JS filter `round.roundId` | one round's matches | **Matches-by-round** |
| `getGlobalRankings` (ranking-update) | Ranking | ScanFilter `rankingId BEGINS_WITH {tid}--` | tournament-global rankings | **Ranking-by-group** |
| `getTournamentRanking` (race-update) | Ranking | ScanFilter `rankingId BEGINS_WITH {tid}--` | tournament-global rankings | **Ranking-by-group** |
| `getRankingsPerRound` (ranking-update) | Ranking | ScanFilter `rankingId BEGINS_WITH {tid}-{roundId}-` | one round's rankings | **Ranking-by-group** |
| `getRaceItems` (race-update) | Race | ScanFilter `raceId BEGINS_WITH race-a-` | the "a" race set | **Race-by-group** |
| `getRaceDItems` (race-update) | Race | ScanFilter `raceId BEGINS_WITH race-d-` | the "d" race set | **Race-by-group** |
| `getRaceItemsForUser` (race-update) | Race | ScanFilter `raceId BEGINS_WITH {userId}-` | one user's race rows | **Race-by-group** |

## C. The five GSIs

Each GSI needs a **new top-level attribute** populated on write (the current keys
embed the value inside a compound string, which a GSI can't key on), then the read
switches from `scan`+filter to `Query` on that attribute.

| GSI | Table | New attribute (partition key) | Value to write | Serves |
| --- | --- | --- | --- | --- |
| **Teams-by-user** | Teams | `userId` | `team.user.userId` | list-teams by user |
| **Teams-by-round** | Teams | `tournamentRound` | `{tid}-{roundId}` | getTeamsInRound, getImpactedTeams |
| **Matches-by-round** | Matches | `tournamentRound` | `{tid}-{roundId}` | list-players |
| **Ranking-by-group** | Ranking | `rankingGroup` | the prefix: `{tid}--` (global) or `{tid}-{roundId}-` | getGlobalRankings, getTournamentRanking, getRankingsPerRound |
| **Race-by-group** | Race | `raceGroup` | `race-a` · `race-d` · `{userId}` | getRaceItems, getRaceDItems, getRaceItemsForUser |

Optional consideration: a sort key on **Teams-by-user** (`tournamentRound`) would
also let you fetch "this user's team in this round" directly, replacing the
`getTeam({teamId})` composite-key lookups if you ever want to.

## D. Write-side changes required (per table)

To back the GSIs, populate the new attribute wherever items are saved:

| Save function | Add attribute |
| --- | --- |
| `saveTeam` / `createTeam` | `userId`, `tournamentRound` |
| `saveMatch` | `tournamentRound` |
| `saveRanking` | `rankingGroup` |
| `saveRaceItem` | `raceGroup` |

## E. Rollout order (safe, no downtime)

1. Add the new attributes in the `save*` functions and deploy — new/updated items
   start carrying them (reads still scan, unaffected).
2. **Backfill** existing rows once (a script that reads each item and rewrites it
   with the new attribute).
3. Create the 5 GSIs (DynamoDB backfills them from the attributes).
4. Switch each read in section B from `scan` to `Query` on the GSI; deploy.
5. Verify each endpoint returns the same data, then the scans are gone.

Scope: 4 tables, 5 GSIs, ~4 write functions touched, ~10 read functions switched.
At current volume (dozens of teams, 254 matches, one tournament) the scans are
cheap; this pays off as tournaments accumulate.
