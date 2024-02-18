import { IMatch, IRound, ILeague } from "./model";

export function matchHasStarted( matchId : string, matches: IMatch[] ) : boolean {
    let m = matches.find((match) => match.matchId === matchId);
    return !!m && ( ( m.matchStartTime && new Date(m.matchStartTime) <= new Date() ) || matchHasWinner(m) );
}

export function matchHasWinner( match : IMatch ) : boolean {
    return match.a.won || match.b.won ;
}

export function deDuplicateRounds( rounds : IRound[] ) : IRound[] {
    const ids = rounds.map(({ roundId }) => roundId );
    const filtered = rounds.filter(({ roundId }, index) => !ids.includes(roundId, index + 1));
    const sorted = filtered.sort( (elemA,elemB) => elemA.sortOrder - elemB.sortOrder );
    return sorted;
}

export function deDuplicateLeagues( leagues : ILeague[] ){
    const ids = leagues.map(({ leagueId }) => leagueId );
    const filtered = leagues.filter(({ leagueId }, index) => !ids.includes(leagueId, index + 1));
    return filtered;
}