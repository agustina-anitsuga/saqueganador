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
  ISelectedPlayer,
  ITeam,
  IUser,
  ITournament,
  IMatch,
} from '@/types/model';
import { photo, QUESTION_MARK } from '@/utils/photos';
import { matchHasStarted as matchStarted } from '@/utils/utils';
import { Multiplier } from './Multiplier';

const MAX_MULTIPLIERS_PER_PLAYER = 3;

interface Props {
  selectedPlayer: ISelectedPlayer;
  mode: 'VIEW' | 'EDIT';
  matches: IMatch[];
  filteredTeam: ITeam;
  loggedInUser: IUser;
  tournament: ITournament;
  availableMultipliers: number;
  onPlayerRemoved: (p: ISelectedPlayer) => void;
  onMultiplierAdded: (p: ISelectedPlayer) => void;
  onMultiplierRemoved: (p: ISelectedPlayer) => void;
  onMoveLeft: (p: ISelectedPlayer) => void;
  onMoveRight: (p: ISelectedPlayer) => void;
}

export function SelectedPlayer(props: Props) {
  const {
    selectedPlayer: sp,
    mode,
    matches,
    filteredTeam,
    loggedInUser,
    tournament,
    availableMultipliers,
  } = props;

  const player = sp.playerStats.player;

  const teamIsOwnedByLoggedInUser = () =>
    !!filteredTeam?.user && !!loggedInUser && filteredTeam.user.userId === loggedInUser.userId;

  const matchHasStarted = () => matchStarted(sp.playerStats.matchId, matches);

  const shouldDisplayPlayer = () =>
    !!player.playerId &&
    (mode === 'EDIT' ||
      (mode === 'VIEW' && !!sp.played) ||
      (mode === 'VIEW' && matchHasStarted()) ||
      (mode === 'VIEW' && teamIsOwnedByLoggedInUser()));

  const playerIsConfirmed = () => sp.confirmed || sp.played;

  const playerCanBeMoved = (p?: ISelectedPlayer) =>
    !!p && !!p.playerStats?.player?.playerId && !p.played && p.confirmed;

  const playerToLeftOf = (p: ISelectedPlayer) => {
    for (let i = p.position - 2; i >= 0; i--) {
      if (playerCanBeMoved(filteredTeam.selection[i])) return filteredTeam.selection[i];
    }
    return null;
  };
  const playerToRightOf = (p: ISelectedPlayer) => {
    for (let i = p.position; i < filteredTeam.selection.length; i++) {
      if (playerCanBeMoved(filteredTeam.selection[i])) return filteredTeam.selection[i];
    }
    return null;
  };

  const currentRoundTeamSize = () => {
    const round = filteredTeam.round;
    const r = tournament.rounds.find((x) => x.roundId === round.roundId);
    return r ? r.teamSize : 0;
  };
  const nextRoundTeamSize = () => {
    const round = filteredTeam.round;
    if (tournament.finalRound === round.roundId) return 1000;
    const r = tournament.rounds.find((x) => x.roundId === round.roundId + 1);
    return r ? r.teamSize : 0;
  };

  const needsNextRoundSelection = () =>
    mode === 'EDIT' && playerCanBeMoved(sp) && currentRoundTeamSize() > nextRoundTeamSize();

  const playerCanBeRemoved = () =>
    mode === 'EDIT' &&
    shouldDisplayPlayer() &&
    !matchHasStarted() &&
    (!sp.pastPick || (sp.pastPick && availableMultipliers >= 1)) &&
    sp.confirmed;

  const playerCanNotBeRemoved = () =>
    mode === 'EDIT' &&
    shouldDisplayPlayer() &&
    (matchHasStarted() ||
      (!!sp.pastPick && availableMultipliers <= 0) ||
      (!sp.confirmed && !sp.played));

  const confirmRemove = () => {
    let warning = '';
    if (sp.pastPick) warning = 'Esto consumirá una pelotita multiplicadora. ';
    Alert.alert('Quitar jugador', `${warning}Quitar a ${player.playerName} de mi equipo?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceptar', onPress: () => props.onPlayerRemoved(sp) },
    ]);
  };

  const confirmAddMultiplier = () => {
    if (sp.playerMultiplier < MAX_MULTIPLIERS_PER_PLAYER && availableMultipliers > 0 && !sp.played) {
      Alert.alert(
        'Multiplicador',
        `Agregar una pelotita multiplicadora a ${player.playerName}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Aceptar', onPress: () => props.onMultiplierAdded(sp) },
        ],
      );
    }
  };

  const confirmRemoveMultiplier = () => {
    if (sp.playerMultiplier > 1 && !sp.played) {
      Alert.alert(
        'Multiplicador',
        `Quitar una pelotita multiplicadora a ${player.playerName}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Aceptar', onPress: () => props.onMultiplierRemoved(sp) },
        ],
      );
    }
  };

  const openProfile = () => {
    if (player.playerProfileUrl) Linking.openURL(player.playerProfileUrl);
  };

  const showPlayer = shouldDisplayPlayer();
  const canRemove = playerCanBeRemoved();
  const canNotRemove = playerCanNotBeRemoved();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.position}>{sp.position ? sp.position : ''}</Text>
        {canRemove && (
          <TouchableOpacity onPress={confirmRemove}>
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        )}
        {canNotRemove && <Text style={styles.pinIcon}>📌</Text>}
      </View>

      <View style={styles.body}>
        {showPlayer ? (
          <>
            <TouchableOpacity onPress={openProfile} style={styles.center}>
              <Image source={photo(player)} style={styles.photo} resizeMode="cover" />
              <Text style={styles.name}>{player.playerName}</Text>
            </TouchableOpacity>
            {playerIsConfirmed() ? (
              <Text style={styles.points}>Puntos en juego {sp.playerStats.pointsToAward}</Text>
            ) : null}

            <Multiplier
              multiplier={sp.playerMultiplier}
              maximumMultipliers={MAX_MULTIPLIERS_PER_PLAYER}
              mode={mode}
              disabled={matchHasStarted()}
              onAdd={confirmAddMultiplier}
              onRemove={confirmRemoveMultiplier}
            />

            {playerIsConfirmed() ? (
              sp.played ? (
                sp.playerScore > 0 ? (
                  <View style={styles.winner}>
                    <Text style={styles.winnerText}>Puntaje {sp.playerScore}</Text>
                  </View>
                ) : (
                  <Text style={styles.lost}>✕</Text>
                )
              ) : (
                <Text style={styles.pending}>Resultado Pendiente</Text>
              )
            ) : (
              <Text style={styles.pending}>Esperando resultado de la ronda anterior</Text>
            )}

            {needsNextRoundSelection() && (
              <View style={styles.moveRow}>
                {playerToLeftOf(sp) ? (
                  <TouchableOpacity onPress={() => props.onMoveLeft(sp)}>
                    <Text style={styles.arrow}>◀</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.arrowSpacer} />
                )}
                {playerToRightOf(sp) ? (
                  <TouchableOpacity onPress={() => props.onMoveRight(sp)}>
                    <Text style={styles.arrow}>▶</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.arrowSpacer} />
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.center}>
            <Image source={QUESTION_MARK} style={styles.question} resizeMode="contain" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.cardHeaderBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 28,
  },
  position: { fontWeight: '700', color: colors.text },
  removeIcon: { color: colors.danger, fontWeight: '700', fontSize: 16 },
  pinIcon: { fontSize: 14 },
  body: { padding: 8, alignItems: 'center' },
  center: { alignItems: 'center' },
  photo: { width: 90, height: 66, borderRadius: 4 },
  name: {
    marginTop: 4,
    fontWeight: '600',
    color: colors.link,
    textAlign: 'center',
    fontSize: 13,
  },
  points: { fontSize: 12, color: colors.muted, marginTop: 2, textAlign: 'center' },
  winner: {
    backgroundColor: colors.winner,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  winnerText: { color: colors.primary, fontWeight: '700' },
  lost: { color: colors.danger, fontSize: 18, fontWeight: '700', marginTop: 4 },
  pending: { fontSize: 12, color: colors.muted, marginTop: 4, textAlign: 'center' },
  question: { width: 70, height: 70, marginVertical: 8 },
  moveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  arrow: { fontSize: 20, color: colors.primary },
  arrowSpacer: { width: 20 },
});
