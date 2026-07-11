import React from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '@/theme';
import {
  IMatch,
  IMatchPlayer,
  IPlayer,
  ISelectedPlayer,
  ITeam,
  ITournament,
} from '@/types/model';
import { photo, QUESTION_MARK } from '@/utils/photos';
import { matchHasStarted } from '@/utils/utils';

interface Props {
  match: IMatch;
  player: IMatchPlayer;
  tournament: ITournament;
  team: ITeam;
  matches: IMatch[];
  onAdd: (p: ISelectedPlayer) => void;
}

export function AvailablePlayer({ match, player, tournament, team, matches, onAdd }: Props) {
  const playerExists = () => !!player.player && !!player.player.playerId;
  const playerHasRival = () => !!player.player && player.pointsToAward > 0;

  const teamContainsPlayer = (p: IPlayer) =>
    !!team?.selection?.find((e) => e.playerStats?.player?.playerId === p.playerId);

  const leagueQuotaFull = (p: IPlayer) => {
    if (!tournament?.activeLeagues) return false;
    const numActiveLeagues = tournament.activeLeagues;
    if (!(p && p.league && p.league.leagueId >= 0) || !team?.selection) return false;
    const quota = team.selection.length / numActiveLeagues;
    const selectedPlayers = team.selection.filter((e) => e.playerStats.player);
    const leaguePlayers = selectedPlayers.filter(
      (e) => e.playerStats?.player?.league?.leagueId === p.league.leagueId,
    );
    return leaguePlayers.length >= quota;
  };

  const shouldAllowAddition = () =>
    !teamContainsPlayer(player.player) &&
    !leagueQuotaFull(player.player) &&
    !matchHasStarted(match.matchId, matches) &&
    playerHasRival();

  const openProfile = () => {
    if (player.player.playerProfileUrl) Linking.openURL(player.player.playerProfileUrl);
  };

  const add = () => {
    Alert.alert('Agregar jugador', `Agregar a ${player.player.playerName} a mi equipo?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: () => {
          const selected: ISelectedPlayer = {
            position: 0,
            playerStats: {
              player: player.player,
              pointsToAward: player.pointsToAward,
              matchId: match.matchId,
            },
            playerMultiplier: 1,
            playerScore: 0,
            played: false,
            pastPick: false,
            confirmed: true,
          };
          onAdd(selected);
        },
      },
    ]);
  };

  if (!playerExists()) {
    return (
      <View style={styles.cell}>
        <Image source={QUESTION_MARK} style={styles.question} resizeMode="contain" />
      </View>
    );
  }

  const canAdd = shouldAllowAddition();

  return (
    <View style={styles.cell}>
      <Image source={photo(player.player)} style={styles.photo} resizeMode="cover" />
      <TouchableOpacity onPress={openProfile}>
        <Text style={styles.name}>{player.player.playerName}</Text>
      </TouchableOpacity>
      {playerHasRival() ? (
        <Text style={styles.points}>Puntos en juego {player.pointsToAward}</Text>
      ) : null}
      {canAdd ? (
        <TouchableOpacity style={styles.addBtn} onPress={add}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    padding: 6,
  },
  photo: { width: 90, height: 66, borderRadius: 4 },
  name: {
    marginTop: 4,
    color: colors.link,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  points: { fontSize: 12, color: colors.muted, marginTop: 2, textAlign: 'center' },
  question: { width: 60, height: 60, marginVertical: 8 },
  addBtn: {
    marginTop: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  addSpacer: { height: 38 },
});
