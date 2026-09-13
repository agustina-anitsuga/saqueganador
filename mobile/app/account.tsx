import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { colors } from '@/theme';
import { useAuth } from '@/context/AuthContext';

export default function Account() {
  const router = useRouter();
  const { user, deleteAccount } = useAuth();
  const [busy, setBusy] = useState(false);

  const doDelete = async () => {
    setBusy(true);
    try {
      await deleteAccount();
      Alert.alert('Cuenta eliminada', 'Tu cuenta fue eliminada permanentemente.');
      router.replace('/welcome');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo eliminar la cuenta.');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar mi cuenta',
      'Esta acción es permanente. Se eliminará tu cuenta y no podrás recuperarla. ¿Querés continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: doDelete },
      ],
    );
  };

  if (!user) {
    return (
      <Screen>
        <Card>
          <CardHeader title="Mi cuenta" />
          <CardBody>
            <Text style={styles.muted}>Ingresá para administrar tu cuenta.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/login')}>
              <Text style={styles.primaryBtnText}>Ingresar</Text>
            </TouchableOpacity>
          </CardBody>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <CardHeader title="Mi cuenta" />
        <CardBody>
          <View style={styles.field}>
            <Text style={styles.label}>Usuario</Text>
            <Text style={styles.value}>{user.preferredUsername || user.username}</Text>
          </View>

          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Eliminar cuenta</Text>
            <Text style={styles.dangerText}>
              Al eliminar tu cuenta se borran permanentemente tus datos de acceso. Esta acción no se
              puede deshacer.
            </Text>
            <TouchableOpacity style={styles.dangerBtn} disabled={busy} onPress={confirmDelete}>
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.dangerBtnText}>Eliminar mi cuenta</Text>
              )}
            </TouchableOpacity>
          </View>
        </CardBody>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { color: colors.muted, marginBottom: 4, fontWeight: '600', fontSize: 13 },
  value: { color: colors.text, fontSize: 16 },
  muted: { color: colors.muted, marginBottom: 16 },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  dangerZone: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    padding: 14,
    backgroundColor: colors.dangerBg,
  },
  dangerTitle: { color: colors.danger, fontWeight: '700', fontSize: 15, marginBottom: 6 },
  dangerText: { color: colors.text, fontSize: 13, marginBottom: 14, lineHeight: 18 },
  dangerBtn: {
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
