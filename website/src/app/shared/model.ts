export interface ITournament {
  tournamentId: number;
  tournamentName: string;
}

export interface IRound {
    roundId: number;
    roundName: string;
    sortOrder: number;
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
    playerId: number;
    playerName: string;
    playerProfilePic: string;
    playerProfileUrl: string;
  }

export interface IPlayerStatsPerRound {
    player : IPlayer;
    pointsToAward: number;  
  }

export interface IMatch {
    player1: IPlayerStatsPerRound;
    player2: IPlayerStatsPerRound;
  }

export interface ISelectedPlayer {
    position : number;
    playerStats : IPlayerStatsPerRound;
    playerMultiplier: number;
    playerScore: number;
    played: boolean;
  }

export interface ITeam {
    teamId: string;
    user: IUser;
    tournament : ITournament;
    round : IRound;
    selection: ISelectedPlayer[];
    score: number;
  }

export function emptyTournament() : ITournament{
  return {
    tournamentId: NaN,
    tournamentName: ''
  };
}

export function emptyTeam() : ITeam {
    return { 
      teamId: '',
      user: emptyUser(),
      tournament: emptyTournament(), 
      round: emptyRound(), 
      selection: [],
      score: NaN } ;
  }  

export function emptyRound() : IRound {
    return { roundId : NaN, roundName : '', sortOrder:NaN };
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
      playerStats : {
        player : {
          playerId: NaN, 
          playerName:'', 
          playerProfilePic:'', 
          playerProfileUrl:'', 
          league: { leagueId: NaN, leagueName: ''} 
        },
        pointsToAward: NaN ,
      },
      playerMultiplier: NaN,
      playerScore: 0,
      played: false
      };
  }

  export function emptyPlayer(){
    return {
      league: { leagueId: NaN, leagueName: '' },
      playerId: NaN,
      playerName: '',
      playerProfilePic: '',
      playerProfileUrl: ''
    };
  }

  export function emptyPlayerStatsPerRound() : IPlayerStatsPerRound {
    return  {
              player : emptyPlayer(),
              pointsToAward: NaN ,
            };
  }