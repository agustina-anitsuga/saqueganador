import { environment } from '@/config/env';
import {
  IMatch,
  IRace,
  IRanking,
  ITeam,
  ITournament,
  IUser,
  IPlayerStatsPerRound,
  ILuckyLoser,
} from '@/types/model';

interface ItemsResponse<T> {
  Items: T[];
  Count?: number;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Server returned code: ${res.status}`);
  }
  return (await res.json()) as T;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Server returned code: ${res.status}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

// ---- Tournament ----
export async function getCurrentTournament(): Promise<ITournament> {
  const data = await getJson<ItemsResponse<ITournament>>(environment.tournamentUrl);
  return data.Items[0];
}

// ---- Ranking ----
export async function getRanking(): Promise<IRanking[]> {
  const data = await getJson<ItemsResponse<IRanking>>(environment.rankingUrl);
  return data.Items;
}

// ---- Race (home) ----
export async function getRace(): Promise<IRace[]> {
  return getJson<IRace[]>(environment.raceUrl);
}

// ---- Teams ----
export async function getTeams(): Promise<ITeam[]> {
  const data = await getJson<ItemsResponse<ITeam>>(environment.teamUrl);
  return data.Items;
}

export async function getTeamsByUser(user: IUser): Promise<ITeam[]> {
  const url = environment.teamUrl + (user ? user.userId : '');
  return getJson<ITeam[]>(url);
}

export async function saveTeam(team: ITeam): Promise<void> {
  const url = environment.teamUrl + team.teamId;
  await postJson<ITeam>(url, team);
}

// ---- Users ----
export async function getGroupUsers(): Promise<IUser[]> {
  const data = await getJson<ItemsResponse<IUser>>(environment.usersUrl);
  return data.Items;
}

// ---- Matches ----
export async function getMatches(): Promise<IMatch[]> {
  const data = await getJson<ItemsResponse<IMatch>>(environment.matchesUrl);
  return data.Items;
}

export async function saveMatch(match: IMatch): Promise<IMatch> {
  const url = environment.matchesUrl + match.matchId;
  return postJson<IMatch>(url, match);
}

// ---- Players in a round (unused directly; matches carry player data) ----
export async function getPlayers(roundId: number): Promise<IPlayerStatsPerRound[]> {
  const url = environment.playersUrl + (roundId ? roundId : 1);
  return getJson<IPlayerStatsPerRound[]>(url);
}

// ---- Admin / Root actions ----
export async function createNextRoundTeams(): Promise<ITeam[]> {
  return postJson<ITeam[]>(environment.createTeamsForRoundUrl, '');
}

export async function moveGameToNextRound(): Promise<ITournament[]> {
  return postJson<ITournament[]>(environment.moveGameToNextRoundUrl, '');
}

export async function addLuckyLoser(luckyLoser: ILuckyLoser): Promise<ILuckyLoser[]> {
  return postJson<ILuckyLoser[]>(environment.addLuckyLoserUrl, luckyLoser);
}
