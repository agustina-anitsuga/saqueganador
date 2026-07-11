import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Select, SelectOption } from '@/components/Select';
import { colors } from '@/theme';
import {
  ILeague,
  IMatch,
  IMatchPlayer,
  ISelectedPlayer,
  ITeam,
  ITournament,
} from '@/types/model';
import { deDuplicateLeagues } from '@/utils/utils';
import { AvailablePlayer } from './AvailablePlayer';

interface Props {
  matches: IMatch[];
  roundId: number;
  team: ITeam;
  tournament: ITournament;
  onAdd: (p: ISelectedPlayer) => void;
}

export function PlayerSelection({ matches, roundId, team, tournament, onAdd }: Props) {
  const [filter, setFilter] = useState('');
  const [leagueIdx, setLeagueIdx] = useState(0);

  const roundMatches = useMemo(
    () => (roundId ? matches.filter((m) => m.round.roundId === roundId) : []),
    [matches, roundId],
  );

  const leagueOptions: SelectOption<number>[] = useMemo(() => {
    const leagues = deDuplicateLeagues(
      roundMatches.map((m) => (m.a.player.league ? m.a.player.league : m.b.player.league)),
    );
    return [
      { label: 'Todas las ligas', value: NaN },
      ...leagues.map((l: ILeague) => ({ label: l.leagueName, value: l.leagueId })),
    ];
  }, [roundMatches]);

  const matchesLeague = (leagueId: number, mp: IMatchPlayer) =>
    mp.player && mp.player.league && !Number.isNaN(leagueId)
      ? mp.player.league.leagueId === leagueId
      : false;

  const filtered = useMemo(() => {
    const leagueId = leagueOptions[leagueIdx]?.value ?? NaN;
    const f = filter.toLowerCase();
    return roundMatches.filter((match) => {
      const nameMatch =
        !f ||
        (match.a.player?.playerName?.toLowerCase().includes(f) ?? false) ||
        (match.b.player?.playerName?.toLowerCase().includes(f) ?? false);
      const leagueMatch =
        Number.isNaN(leagueId) ||
        matchesLeague(leagueId, match.a) ||
        matchesLeague(leagueId, match.b);
      return nameMatch && leagueMatch;
    });
  }, [roundMatches, filter, leagueIdx, leagueOptions]);

  return (
    <Card>
      <CardHeader title="Jugadores" />
      <CardBody>
        <View style={styles.filterRow}>
          <Text style={styles.label}>Liga</Text>
          <Select
            options={leagueOptions}
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

        {filtered.map((match) => (
          <View key={match.matchId} style={styles.match}>
            <View style={styles.matchRow}>
              <AvailablePlayer
                match={match}
                player={match.a}
                tournament={tournament}
                team={team}
                matches={matches}
                onAdd={onAdd}
              />
              <AvailablePlayer
                match={match}
                player={match.b}
                tournament={tournament}
                team={team}
                matches={matches}
                onAdd={onAdd}
              />
            </View>
            {match.matchStartTime ? (
              <Text style={styles.time}>{String(match.matchStartTime).replace('T', ' ')}</Text>
            ) : null}
          </View>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.muted}>No hay partidos para esta ronda.</Text>
        )}
      </CardBody>
    </Card>
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
  match: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    padding: 6,
  },
  matchRow: { flexDirection: 'row' },
  time: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 4 },
  muted: { color: colors.muted, paddingVertical: 8 },
});
