export interface ITournament {
  tournamentId: number;
  tournamentName: string;
  currentRound: IRound;
}

export interface IRound {
    roundId: number;
    roundName: string;
  }

export interface IUser {
    userId: number;
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
    user: IUser;
    tournament : ITournament;
    round : IRound;
    selection: ISelectedPlayer[];
    score: number;
  }