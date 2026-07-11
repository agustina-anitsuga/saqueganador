import { ISelectedPlayer, ITeam, ITournament } from '@/types/model';

export function fixPositions(team: ITeam) {
  if (team?.selection) {
    for (let i = 0; i < team.selection.length; i++) {
      if (team.selection[i] && !team.selection[i].position) {
        team.selection[i].position = i + 1;
      }
    }
  }
}

export function selectedPlayerCount(team: ITeam): number {
  return team?.selection
    ? team.selection.reduce((sum, item) => sum + (item.playerStats.player.playerId ? 1 : 0), 0)
    : 0;
}

export function maximumMultipliers(team: ITeam): number {
  if (!team?.selection) return 1;
  return team.selection.length + (team.selection.length > 2 ? 2 : 1);
}

export function penaltyMultipliers(team: ITeam): number {
  return team ? team.penaltyMultipliers || 0 : 0;
}

export function consumedMultipliers(team: ITeam): number {
  let rta = 0;
  if (team?.selection) {
    for (let i = 0; i < team.selection.length; i++) {
      rta += team.selection[i].playerMultiplier || 0;
    }
    rta += penaltyMultipliers(team);
  }
  return rta;
}

export function allPlayersSelected(team: ITeam): boolean {
  return !!team?.selection && team.selection.every((p) => p.playerStats.player.playerId);
}

export function allMatchesPlayed(team: ITeam): boolean {
  return !!team?.selection && team.selection.every((p) => !!p.played);
}

export function availableMultipliers(team: ITeam): number {
  if (!team?.selection) return 0;
  return allPlayersSelected(team) && allMatchesPlayed(team)
    ? 0
    : maximumMultipliers(team) + selectedPlayerCount(team) - consumedMultipliers(team);
}

export function maximumPossibleScore(team: ITeam): number {
  if (!team?.selection) return 0;
  return team.selection.reduce((sum, s) => {
    if (!s) return sum;
    if (s.played) return sum + s.playerScore;
    const mult = s.playerMultiplier || 1;
    return sum + mult * s.playerStats.pointsToAward;
  }, 0);
}

export function currentRoundTeamSize(team: ITeam, tournament: ITournament): number {
  if (!team) return 0;
  const round = team.round;
  const r = round ? tournament.rounds.find((x) => x.roundId === round.roundId) : undefined;
  return r ? r.teamSize : 0;
}

export function nextRoundTeamSize(team: ITeam, tournament: ITournament): number {
  if (!team) return 0;
  const round = team.round;
  if (tournament.finalRound === round.roundId) {
    const finalRound = tournament.rounds.find((x) => x.roundId === round.roundId);
    return finalRound ? finalRound.teamSize : 1000;
  }
  const r = tournament.rounds.find((x) => x.roundId === round.roundId + 1);
  return r ? r.teamSize : 0;
}

export function needsNextRoundSelection(team: ITeam, tournament: ITournament): boolean {
  return currentRoundTeamSize(team, tournament) > nextRoundTeamSize(team, tournament);
}

export function nextRoundSelectionMessage(team: ITeam, tournament: ITournament): string {
  const size = nextRoundTeamSize(team, tournament);
  if (size === 1) return 'Sólo el jugador en la posición 1 pasa a la ronda siguiente.';
  if (size === 2) return 'Sólo los jugadores en las posiciones 1 y 2 pasan a la ronda siguiente.';
  return `Sólo los jugadores en las posiciones 1 a ${size} pasan a la ronda siguiente.`;
}

function leagueCounts(team: ITeam, size: number) {
  let atp = 0;
  let wta = 0;
  for (let i = 0; i < size; i++) {
    const p = team.selection[i];
    const league = p?.playerStats?.player?.league;
    if (league?.leagueName === 'ATP') atp++;
    if (league?.leagueName === 'WTA') wta++;
  }
  return { atp, wta };
}

export function currentRoundTeamDoesNotMeetRequirements(
  team: ITeam,
  tournament: ITournament,
): boolean {
  if (!tournament || tournament.activeLeagues === 1) return false;
  const size = currentRoundTeamSize(team, tournament);
  const { atp, wta } = leagueCounts(team, size);
  return atp > size / 2 || wta > size / 2;
}

export function nextRoundTeamDoesNotMeetRequirements(
  team: ITeam,
  tournament: ITournament,
): boolean {
  if (tournament.activeLeagues === 1) return false;
  const size = nextRoundTeamSize(team, tournament);
  const { atp, wta } = leagueCounts(team, size);
  return needsNextRoundSelection(team, tournament) && (atp > size / 2 || wta > size / 2);
}

// Swap two players' positions (used for reordering into next round).
export function swap(team: ITeam, left: ISelectedPlayer, right: ISelectedPlayer) {
  const tempL: ISelectedPlayer = JSON.parse(JSON.stringify(left));
  const tempR: ISelectedPlayer = JSON.parse(JSON.stringify(right));
  const posL = tempL.position;
  const posR = tempR.position;
  team.selection[posL - 1] = tempR;
  team.selection[posL - 1].position = posL;
  team.selection[posR - 1] = tempL;
  team.selection[posR - 1].position = posR;
}

export function playerCanBeMoved(p?: ISelectedPlayer): boolean {
  return !!p && !!p.playerStats?.player?.playerId && !p.played && p.confirmed;
}

export function playerLeftOf(team: ITeam, p: ISelectedPlayer): ISelectedPlayer | null {
  for (let i = p.position - 2; i >= 0; i--) {
    if (playerCanBeMoved(team.selection[i])) return team.selection[i];
  }
  return null;
}

export function playerRightOf(team: ITeam, p: ISelectedPlayer): ISelectedPlayer | null {
  for (let i = p.position; i < team.selection.length; i++) {
    if (playerCanBeMoved(team.selection[i])) return team.selection[i];
  }
  return null;
}
