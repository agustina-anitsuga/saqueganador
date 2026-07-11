import { IMatch, IRound, ILeague } from '@/types/model';

export function matchHasWinner(match: IMatch): boolean {
  return match.a.won || match.b.won;
}

export function matchHasStarted(matchId: string, matches: IMatch[]): boolean {
  const m = matches.find((match) => match.matchId === matchId);
  return (
    !!m &&
    ((!!m.matchStartTime && new Date(m.matchStartTime) <= new Date()) || matchHasWinner(m))
  );
}

export function deDuplicateRounds(rounds: IRound[]): IRound[] {
  const ids = rounds.map(({ roundId }) => roundId);
  const filtered = rounds.filter(({ roundId }, index) => !ids.includes(roundId, index + 1));
  return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function deDuplicateLeagues(leagues: ILeague[]): ILeague[] {
  const ids = leagues.map(({ leagueId }) => leagueId);
  return leagues.filter(({ leagueId }, index) => !ids.includes(leagueId, index + 1));
}
