
export interface ITournament {
  tournamentId: number;
  tournamentName: string;
  activeLeagues: number;
  rounds: IRound[];
  currentRound: number;
  finalRound: number;
  admins: string[]
}

export interface IRound {
    roundId: number;
    roundName: string;
    sortOrder: number;
    teamSize: number;
  }

export interface IUser {
    userId: string;
    userName: string;
  }

export interface IRanking {
    tournament: ITournament;
    round: IRound;
    user: IUser;
    score: number;
    position: number;
  }

export interface ILeague {
    leagueId : number;
    leagueName : string;
  }

export interface IPlayer {
    league: ILeague;
    playerId: string;
    playerName: string;
    playerProfilePic: string;
    playerProfileUrl: string;
    ranking: number;
    winRatio: number;
  }

export interface IPlayerStatsPerRound {
    player : IPlayer;
    pointsToAward: number;  
    matchId: string;
  }

export interface ISelectedPlayer {
    position : number;
    playerStats : IPlayerStatsPerRound;
    playerMultiplier: number;
    playerScore: number;
    played: boolean;
    pastPick: boolean;
    confirmed: boolean;
  }

export interface ITeam {
    teamId: string;
    user: IUser;
    tournament : ITournament;
    round : IRound;
    selection: ISelectedPlayer[];
    score: number;
    penaltyMultipliers: number;
  }

export function emptyTournament() : ITournament{
  return {
    tournamentId: NaN,
    tournamentName: '',
    activeLeagues: NaN,
    rounds: [],
    currentRound: NaN,
    finalRound: NaN,
    admins: []
  };
}

export function emptyTeam() : ITeam {
    return { 
      teamId: '',
      user: emptyUser(),
      tournament: emptyTournament(), 
      round: emptyRound(), 
      selection: [],
      score: NaN,
      penaltyMultipliers: 0, 
    } ;
  }  

export function emptyRound() : IRound {
    return { roundId : NaN, roundName : '', sortOrder:NaN, teamSize:NaN };
  }

export function emptyUser() : IUser {
    return { userId : '', userName: '' };
  }

export function emptyLeague() : ILeague {
    return { leagueId: NaN, leagueName: '' };
  }

export function emptySelectedPlayer() : ISelectedPlayer {
    return { 
      position : NaN,
      playerStats : emptyPlayerStatsPerRound(),
      playerMultiplier: NaN,
      playerScore: 0,
      played: false,
      pastPick: false,
      confirmed: true
      };
  }

  export function emptyPlayer(){
    return {
      league: { leagueId: NaN, leagueName: '' },
      playerId: '',
      playerName: '',
      playerProfilePic: '',
      playerProfileUrl: '',
      ranking: 0,
      winRatio: 0
    };
  }

  export function emptyPlayerStatsPerRound() : IPlayerStatsPerRound {
    return  {
              player : emptyPlayer(),
              pointsToAward: NaN ,
              matchId: ''
            };
  }


export interface IMatchPlayer {
  player: IPlayer;
  pointsToAward: number;
  won: boolean;
}

export interface IMatch {
  matchId : string;
  tournament : ITournament;
  round : IRound;
  a : IMatchPlayer;
  b : IMatchPlayer;
  matchStartTime : Date;
}

export function emptyMatchPlayer(): IMatchPlayer {
  return { 
    player: emptyPlayer(),
    pointsToAward: 0,
    won: false
  }
}

export function emptyMatch() : IMatch {
    return {
      matchId : '',
      tournament : emptyTournament(),
      round : emptyRound(),
      a : emptyMatchPlayer(),
      b : emptyMatchPlayer(),
      matchStartTime : new Date(2024, 1, 14, 22, 0) 
    };
}

export interface IRace {
  raceId : string;
  points : number;
  dPoints: number;
  user : IUser;
  position: number
}
