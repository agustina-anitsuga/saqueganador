import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/Card';
import { Select, SelectOption } from '@/components/Select';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme';
import {
  IMatch,
  IRound,
  ISelectedPlayer,
  ITeam,
  IUser,
  emptyRound,
  emptySelectedPlayer,
  emptyTeam,
  emptyUser,
} from '@/types/model';
import { getGroupUsers, getMatches, getTeams, getTeamsByUser, saveTeam } from '@/api/api';
import { deDuplicateRounds } from '@/utils/utils';
import { TENNIS_BALL, EMPTY_BALL } from '@/utils/photos';
import { useAuth } from '@/context/AuthContext';
import { useTournament } from '@/context/TournamentContext';
import { SelectedPlayer } from './SelectedPlayer';
import { PlayerSelection } from './PlayerSelection';
import * as logic from './teamLogic';

interface Props {
  mode: 'VIEW' | 'EDIT';
  userIdParam?: string;
}

export function TeamContainer({ mode, userIdParam }: Props) {
  const { user } = useAuth();
  const { tournament } = useTournament();

  const [teams, setTeams] = useState<ITeam[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [rounds, setRounds] = useState<IRound[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRoundId, setSelectedRoundId] = useState<number>(NaN);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loggedInUser: IUser = useMemo(
    () => (user ? { userId: user.username, userName: '' } : emptyUser()),
    [user],
  );

  const load = useCallback(async () => {
    setError('');
    try {
      const allMatches = await getMatches();
      setMatches(allMatches);

      if (mode === 'VIEW') {
        const [t, u] = await Promise.all([getTeams(), getGroupUsers()]);
        const sorted = [...u].sort((a, b) =>
          a.userName.toLowerCase().localeCompare(b.userName.toLowerCase()),
        );
        setUsers(sorted);
        setTeams(t);
        const rs = deDuplicateRounds(t.map((x) => x.round));
        setRounds(rs);
        setSelectedRoundId((prev) => (isNaN(prev) && rs.length ? rs[rs.length - 1].roundId : prev));
        setSelectedUserId((prev) => {
          if (prev) return prev;
          if (userIdParam) return userIdParam;
          if (loggedInUser.userId) return loggedInUser.userId;
          return sorted.length ? sorted[0].userId : '';
        });
      } else {
        if (!loggedInUser.userId) {
          setTeams([]);
          return;
        }
        const t = await getTeamsByUser(loggedInUser);
        setTeams(t);
        const rs = deDuplicateRounds(t.map((x) => x.round));
        setRounds(rs);
        setSelectedUserId(loggedInUser.userId);
        setSelectedRoundId((prev) => (isNaN(prev) && rs.length ? rs[rs.length - 1].roundId : prev));
      }
    } catch (e) {
      setError(String(e));
    }
  }, [mode, userIdParam, loggedInUser]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filteredTeam: ITeam = useMemo(() => {
    void version;
    const t = teams.find(
      (x) => x.user.userId === selectedUserId && x.round.roundId === selectedRoundId,
    );
    if (t) logic.fixPositions(t);
    return t ?? emptyTeam();
  }, [teams, selectedUserId, selectedRoundId, version]);

  const persist = useCallback(async (team: ITeam) => {
    setVersion((v) => v + 1);
    try {
      await saveTeam(team);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  // ---- Mutations (EDIT only) ----
  const addPlayer = useCallback(
    (toAdd: ISelectedPlayer) => {
      const team = filteredTeam;
      for (let i = 0; i < team.selection.length; i++) {
        if (!team.selection[i].playerStats.player.playerId) {
          team.selection[i] = toAdd;
          logic.fixPositions(team);
          persist(team);
          break;
        }
      }
    },
    [filteredTeam, persist],
  );

  const removePlayer = useCallback(
    (p: ISelectedPlayer) => {
      const team = filteredTeam;
      const index = team.selection.findIndex(
        (e) => e.playerStats.player.playerId === p.playerStats.player.playerId,
      );
      if (index >= 0) {
        team.selection[index] = emptySelectedPlayer();
        team.selection[index].position = index + 1;
      }
      if (p.pastPick) {
        team.penaltyMultipliers = logic.penaltyMultipliers(team) + 1;
      }
      persist(team);
    },
    [filteredTeam, persist],
  );

  const addMultiplier = useCallback(
    (p: ISelectedPlayer) => {
      const team = filteredTeam;
      const target = team.selection.find(
        (e) => e.playerStats.player.playerId === p.playerStats.player.playerId,
      );
      if (target) target.playerMultiplier = target.playerMultiplier + 1;
      persist(team);
    },
    [filteredTeam, persist],
  );

  const removeMultiplier = useCallback(
    (p: ISelectedPlayer) => {
      const team = filteredTeam;
      const target = team.selection.find(
        (e) => e.playerStats.player.playerId === p.playerStats.player.playerId,
      );
      if (target) target.playerMultiplier = target.playerMultiplier - 1;
      persist(team);
    },
    [filteredTeam, persist],
  );

  const moveLeft = useCallback(
    (p: ISelectedPlayer) => {
      const team = filteredTeam;
      const left = logic.playerLeftOf(team, p);
      if (left) {
        logic.swap(team, left, p);
        persist(team);
      }
    },
    [filteredTeam, persist],
  );

  const moveRight = useCallback(
    (p: ISelectedPlayer) => {
      const team = filteredTeam;
      const right = logic.playerRightOf(team, p);
      if (right) {
        logic.swap(team, p, right);
        persist(team);
      }
    },
    [filteredTeam, persist],
  );

  // ---- Options for selects ----
  const userOptions: SelectOption<string>[] = useMemo(
    () => users.map((u) => ({ label: u.userName, value: u.userId })),
    [users],
  );
  const roundOptions: SelectOption<number>[] = useMemo(
    () => rounds.map((r) => ({ label: r.roundName, value: r.roundId })),
    [rounds],
  );
  const userIndex = userOptions.findIndex((o) => o.value === selectedUserId);
  const roundIndex = roundOptions.findIndex((o) => o.value === selectedRoundId);

  const availMult = logic.availableMultipliers(filteredTeam);
  const maxMult = logic.maximumMultipliers(filteredTeam);
  const showScore = filteredTeam && filteredTeam.score >= 0;

  const teamName = filteredTeam?.user?.userName || '';

  if (mode === 'EDIT' && !loggedInUser.userId) {
    return (
      <Screen>
        <Card>
          <CardHeader title="Armar mi equipo" />
          <CardBody>
            <Text style={styles.muted}>
              Necesitás ingresar para armar tu equipo. Andá a "Ingresar" en el menú.
            </Text>
          </CardBody>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <Card>
        <CardHeader title={`Equipo ${teamName}`} />
        <CardBody>
          {mode === 'VIEW' && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Equipo:</Text>
              <Select
                options={userOptions}
                selectedIndex={userIndex < 0 ? 0 : userIndex}
                onSelect={(i) => setSelectedUserId(userOptions[i].value)}
                style={styles.select}
              />
            </View>
          )}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Ronda:</Text>
            <Select
              options={roundOptions}
              selectedIndex={roundIndex < 0 ? 0 : roundIndex}
              onSelect={(i) => setSelectedRoundId(roundOptions[i].value)}
              style={styles.select}
            />
          </View>

          {mode === 'EDIT' && filteredTeam.selection.length > 0 && (
            <View style={styles.multRow}>
              <Text style={styles.filterLabel}>Multiplicadores:</Text>
              <View style={styles.balls}>
                {Array.from({ length: Math.max(0, availMult) }).map((_, i) => (
                  <Image key={`am-${i}`} source={TENNIS_BALL} style={styles.ball} />
                ))}
                {Array.from({ length: Math.max(0, maxMult - Math.max(0, availMult)) }).map((_, i) => (
                  <Image key={`em-${i}`} source={EMPTY_BALL} style={styles.ball} />
                ))}
              </View>
            </View>
          )}

          {mode === 'EDIT' && logic.needsNextRoundSelection(filteredTeam, tournament) && (
            <View style={styles.warning}>
              <Text style={styles.warningText}>
                {logic.nextRoundSelectionMessage(filteredTeam, tournament)}
              </Text>
            </View>
          )}
          {mode === 'EDIT' &&
            logic.currentRoundTeamDoesNotMeetRequirements(filteredTeam, tournament) && (
              <View style={styles.danger}>
                <Text style={styles.dangerText}>
                  Tu equipo no cumple con el requisito de tener 50% de jugadores de ATP y 50% de WTA.
                  Corregilo para evitar una penalización de una pelotita multiplicadora en la
                  siguiente ronda!
                </Text>
              </View>
            )}
          {mode === 'EDIT' &&
            logic.nextRoundTeamDoesNotMeetRequirements(filteredTeam, tournament) && (
              <View style={styles.danger}>
                <Text style={styles.dangerText}>
                  Tu equipo para la próxima ronda no cumple con el requisito de tener 50% de
                  jugadores de ATP y 50% de WTA. Corregilo para evitar una penalización de una
                  pelotita multiplicadora!
                </Text>
              </View>
            )}

          <View style={styles.grid}>
            {filteredTeam.selection.map((sp, i) => (
              <View key={`sp-${i}`} style={styles.gridItem}>
                <SelectedPlayer
                  selectedPlayer={sp}
                  mode={mode}
                  matches={matches}
                  filteredTeam={filteredTeam}
                  loggedInUser={loggedInUser}
                  tournament={tournament}
                  availableMultipliers={availMult}
                  onPlayerRemoved={removePlayer}
                  onMultiplierAdded={addMultiplier}
                  onMultiplierRemoved={removeMultiplier}
                  onMoveLeft={moveLeft}
                  onMoveRight={moveRight}
                />
              </View>
            ))}
            {filteredTeam.selection.length === 0 && (
              <Text style={styles.muted}>No hay equipo para esta ronda.</Text>
            )}
          </View>
        </CardBody>
        {showScore && (
          <CardFooter>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Puntos en la ronda:</Text>
              <Text style={styles.scoreValue}>{filteredTeam.score}</Text>
            </View>
            {mode === 'EDIT' && (
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Máximo puntaje posible:</Text>
                <Text style={styles.scoreValue}>{logic.maximumPossibleScore(filteredTeam)}</Text>
              </View>
            )}
          </CardFooter>
        )}
      </Card>

      {mode === 'EDIT' && (
        <PlayerSelection
          matches={matches}
          roundId={selectedRoundId}
          team={filteredTeam}
          tournament={tournament}
          onAdd={addPlayer}
        />
      )}

      {error ? (
        <View style={styles.alert}>
          <Text style={styles.alertText}>Error: {error}</Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  filterLabel: { marginRight: 10, color: colors.text, fontWeight: '600' },
  select: { flex: 1, maxWidth: 240 },
  multRow: { marginBottom: 12 },
  balls: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  ball: { width: 22, height: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  gridItem: { width: '50%', padding: 4 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  scoreLabel: { color: colors.text, fontWeight: '600' },
  scoreValue: { color: colors.text, fontWeight: '700' },
  warning: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  warningText: { color: '#8a6d3b' },
  danger: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  dangerText: { color: colors.danger },
  muted: { color: colors.muted, paddingVertical: 8 },
  alert: { backgroundColor: colors.dangerBg, borderRadius: 6, padding: 12 },
  alertText: { color: colors.danger },
});
