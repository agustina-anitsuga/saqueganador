import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Select, SelectOption } from '@/components/Select';
import { MatchCard } from '@/components/admin/MatchCard';
import { colors } from '@/theme';
import { IMatch, IMatchPlayer, IRound } from '@/types/model';
import { getMatches } from '@/api/api';
import { deDuplicateRounds } from '@/utils/utils';
import { useAuth } from '@/context/AuthContext';
import { useTournament } from '@/context/TournamentContext';

const LEAGUES: SelectOption<number>[] = [
  { label: 'Todas', value: NaN },
  { label: 'ATP', value: 1 },
  { label: 'WTA', value: 2 },
];

export default function Admin() {
  const { user } = useAuth();
  const { tournament } = useTournament();
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [rounds, setRounds] = useState<IRound[]>([]);
  const [roundId, setRoundId] = useState<number>(NaN);
  const [leagueIdx, setLeagueIdx] = useState(0);
  const [filter, setFilter] = useState('');
  const [noTime, setNoTime] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = tournament.admins?.includes(user?.username ?? '');

  const load = useCallback(async () => {
    setError('');
    try {
      const m = await getMatches();
      setMatches(m);
      const rs = deDuplicateRounds(m.map((x) => x.round));
      setRounds(rs);
      setRoundId((prev) => (isNaN(prev) && rs.length ? rs[rs.length - 1].roundId : prev));
    } catch (e) {
      setError(String(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const roundOptions: SelectOption<number>[] = useMemo(
    () => rounds.map((r) => ({ label: r.roundName, value: r.roundId })),
    [rounds],
  );
  const roundIndex = roundOptions.findIndex((o) => o.value === roundId);

  const matchesLeague = (leagueId: number, mp: IMatchPlayer) =>
    mp.player && mp.player.league && !Number.isNaN(leagueId)
      ? mp.player.league.leagueId === leagueId
      : false;

  const filtered = useMemo(() => {
    const leagueId = LEAGUES[leagueIdx].value;
    const f = filter.toLowerCase();
    return matches
      .filter((m) => m.round.roundId === roundId)
      .filter(
        (m) =>
          Number.isNaN(leagueId) || matchesLeague(leagueId, m.a) || matchesLeague(leagueId, m.b),
      )
      .filter(
        (m) =>
          !f ||
          (m.a.player?.playerName?.toLowerCase().includes(f) ?? false) ||
          (m.b.player?.playerName?.toLowerCase().includes(f) ?? false),
      )
      .filter((m) => !noResult || !(m.a.won || m.b.won))
      .filter((m) => !noTime || !m.matchStartTime);
  }, [matches, roundId, leagueIdx, filter, noResult, noTime]);

  if (!isAdmin) {
    return (
      <Screen>
        <Card>
          <CardHeader title="Administrar Partidos" />
          <CardBody>
            <Text style={styles.muted}>No tenés permisos de administrador.</Text>
          </CardBody>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <Card>
        <CardHeader title="Administrar Partidos" />
        <CardBody>
          <View style={styles.filterRow}>
            <Text style={styles.label}>Ronda</Text>
            <Select
              options={roundOptions}
              selectedIndex={roundIndex < 0 ? 0 : roundIndex}
              onSelect={(i) => setRoundId(roundOptions[i].value)}
              style={styles.select}
            />
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.label}>Liga</Text>
            <Select
              options={LEAGUES}
              selectedIndex={leagueIdx}
              onSelect={setLeagueIdx}
              style={styles.select}
            />
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.label}>Jugador</Text>
            <TextInput
              style={styles.input}
              value={filter}
              onChangeText={setFilter}
              placeholder="Buscar…"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.togglesRow}>
            <View style={styles.toggle}>
              <Text style={styles.toggleLabel}>Sin horario</Text>
              <Switch value={noTime} onValueChange={setNoTime} />
            </View>
            <View style={styles.toggle}>
              <Text style={styles.toggleLabel}>Sin resultado</Text>
              <Switch value={noResult} onValueChange={setNoResult} />
            </View>
          </View>

          {filtered.map((m) => (
            <MatchCard key={m.matchId} match={m} />
          ))}
          {filtered.length === 0 && !error && (
            <Text style={styles.muted}>No hay partidos con esos filtros.</Text>
          )}
        </CardBody>
      </Card>
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
  label: { width: 64, color: colors.text, fontWeight: '600' },
  select: { flex: 1 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    color: colors.text,
  },
  togglesRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { color: colors.text },
  muted: { color: colors.muted, paddingVertical: 8 },
  alert: { backgroundColor: colors.dangerBg, borderRadius: 6, padding: 12 },
  alertText: { color: colors.danger },
});
