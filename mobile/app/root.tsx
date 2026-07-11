import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { colors } from '@/theme';
import { addLuckyLoser, createNextRoundTeams, moveGameToNextRound } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { useTournament } from '@/context/TournamentContext';

export default function Root() {
  const { user } = useAuth();
  const { tournament } = useTournament();
  const [matchPlayerId, setMatchPlayerId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [busy, setBusy] = useState(false);

  const isRoot = tournament.root?.includes(user?.username ?? '');

  const currentRound = () => {
    const round = tournament.rounds.find((r) => r.roundId === tournament.currentRound);
    return `${tournament.currentRound} - ${round ? round.roundName : ''}`;
  };

  const run = async (fn: () => Promise<unknown>, okMsg: string) => {
    setBusy(true);
    try {
      await fn();
      Alert.alert('OK', okMsg);
    } catch (e: any) {
      Alert.alert('Error', String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  };

  if (!isRoot) {
    return (
      <Screen>
        <Card>
          <CardHeader title="Administrar Juego" />
          <CardBody>
            <Text style={styles.muted}>No tenés permisos de root.</Text>
          </CardBody>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <CardHeader title="Controlar ronda actual" />
        <CardBody>
          <Text style={styles.roundLabel}>Ronda actual:</Text>
          <Text style={styles.roundValue}>{currentRound()}</Text>

          <TouchableOpacity
            style={styles.btn}
            disabled={busy}
            onPress={() => run(createNextRoundTeams, 'Ronda iniciada')}
          >
            <Text style={styles.btnText}>Crear equipos para ronda siguiente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            disabled={busy}
            onPress={() => run(moveGameToNextRound, 'Juego avanzado a la ronda siguiente')}
          >
            <Text style={styles.btnText}>Mover el juego a la ronda siguiente</Text>
          </TouchableOpacity>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Agregar lucky losers" />
        <CardBody>
          <Text style={styles.label}>Match Player Id</Text>
          <TextInput
            style={styles.input}
            value={matchPlayerId}
            onChangeText={setMatchPlayerId}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Player Id</Text>
          <TextInput
            style={styles.input}
            value={playerId}
            onChangeText={setPlayerId}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.btn}
            disabled={busy}
            onPress={() =>
              run(() => addLuckyLoser({ matchPlayerId, playerId }), 'Lucky loser agregado')
            }
          >
            <Text style={styles.btnText}>Agregar</Text>
          </TouchableOpacity>
        </CardBody>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  roundLabel: { color: colors.text, fontWeight: '600' },
  roundValue: { color: colors.text, marginBottom: 16, fontSize: 16 },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  label: { color: colors.text, fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    color: colors.text,
  },
  muted: { color: colors.muted, paddingVertical: 8 },
});
