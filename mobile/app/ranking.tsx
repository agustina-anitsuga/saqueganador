import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Select, SelectOption } from '@/components/Select';
import { colors } from '@/theme';
import { IRanking, IRound } from '@/types/model';
import { getRanking } from '@/api/api';
import { deDuplicateRounds } from '@/utils/utils';

function sortRanking(ranking: IRanking[]): IRanking[] {
  return [...ranking].sort((a, b) => {
    const adiff = a.position - b.position;
    if (adiff !== 0) return adiff;
    return a.user.userName.toLowerCase() < b.user.userName.toLowerCase() ? -0.1 : 0.1;
  });
}

export default function Ranking() {
  const router = useRouter();
  const [ranking, setRanking] = useState<IRanking[]>([]);
  const [rounds, setRounds] = useState<IRound[]>([]);
  // -1 => Global (no round)
  const [selectedRoundIdx, setSelectedRoundIdx] = useState(-1);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      const r = await getRanking();
      setRanking(r);
      const rs = deDuplicateRounds(r.map((x) => x.round).filter((round) => round && round.roundId));
      setRounds(rs.sort((a, b) => a.sortOrder - b.sortOrder));
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

  const options: SelectOption<number>[] = useMemo(
    () => [
      { label: 'Global', value: -1 },
      ...rounds.map((r) => ({ label: r.roundName, value: r.roundId })),
    ],
    [rounds],
  );

  const filtered = useMemo(() => {
    if (selectedRoundIdx <= 0) {
      // Global ranking: entries without a round id
      return sortRanking(ranking.filter((r) => !r.round || !r.round.roundId));
    }
    const roundId = options[selectedRoundIdx].value;
    return sortRanking(ranking.filter((r) => r.round.roundId === roundId));
  }, [ranking, selectedRoundIdx, options]);

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <Card>
        <CardHeader title="Ranking" />
        <CardBody>
          {ranking.length > 0 && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Ronda:</Text>
              <Select
                options={options}
                selectedIndex={selectedRoundIdx < 0 ? 0 : selectedRoundIdx}
                onSelect={(i) => setSelectedRoundIdx(i === 0 ? -1 : i)}
                style={styles.select}
              />
            </View>
          )}

          <View style={styles.headerRow}>
            <Text style={[styles.headCell, styles.pos]}>Posición</Text>
            <Text style={[styles.headCell, styles.player]}>Jugador</Text>
            <Text style={[styles.headCell, styles.pts]}>Puntos</Text>
          </View>
          {filtered.map((r, i) => (
            <View key={`${r.user.userId}-${i}`} style={styles.row}>
              <Text style={styles.pos}>{r.position}</Text>
              <TouchableOpacity
                style={styles.player}
                onPress={() => router.push(`/teams/${r.user.userId}` as never)}
              >
                <Text style={styles.link}>{r.user.userName}</Text>
              </TouchableOpacity>
              <Text style={styles.pts}>{r.score}</Text>
            </View>
          ))}
          {ranking.length === 0 && !error && (
            <Text style={styles.muted}>Cargando ranking…</Text>
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    marginRight: 10,
    color: colors.text,
    fontWeight: '600',
  },
  select: {
    flex: 1,
    maxWidth: 220,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },
  headCell: {
    fontWeight: '700',
    color: colors.muted,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pos: { width: 80, fontSize: 14, color: colors.text },
  player: { flex: 1 },
  pts: { width: 60, textAlign: 'right', fontSize: 14, color: colors.text },
  link: { color: colors.link, fontSize: 14 },
  muted: { color: colors.muted, paddingVertical: 8 },
  alert: {
    backgroundColor: colors.dangerBg,
    borderRadius: 6,
    padding: 12,
  },
  alertText: { color: colors.danger },
});
