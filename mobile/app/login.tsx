import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { colors } from '@/theme';
import { useAuth } from '@/context/AuthContext';

type Mode = 'signIn' | 'signUp' | 'confirm';

export default function Login() {
  const router = useRouter();
  const { signIn, signUp, confirmSignUp } = useAuth();

  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setError('');
    setInfo('');
    setBusy(true);
    try {
      await fn();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  const onSignIn = () =>
    run(async () => {
      await signIn(email.trim(), password);
      router.replace('/welcome');
    });

  const onSignUp = () =>
    run(async () => {
      const complete = await signUp(email.trim(), username.trim(), password);
      if (complete) {
        setInfo('Cuenta creada. Ya podés ingresar.');
        setMode('signIn');
      } else {
        setInfo('Te enviamos un código a tu email. Ingresalo para confirmar.');
        setMode('confirm');
      }
    });

  const onConfirm = () =>
    run(async () => {
      await confirmSignUp(email.trim(), code.trim());
      setInfo('Cuenta confirmada. Ya podés ingresar.');
      setMode('signIn');
    });

  return (
    <Screen>
      <Card>
        <CardHeader
          title={
            mode === 'signIn'
              ? 'Ingresar'
              : mode === 'signUp'
                ? 'Crear cuenta'
                : 'Confirmar cuenta'
          }
        />
        <CardBody>
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

          {mode === 'signUp' && (
            <Field label="Nombre de usuario" value={username} onChangeText={setUsername} />
          )}

          {mode !== 'confirm' && (
            <Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
          )}

          {mode === 'confirm' && (
            <Field label="Código de confirmación" value={code} onChangeText={setCode} keyboardType="number-pad" />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <TouchableOpacity
            style={styles.primaryBtn}
            disabled={busy}
            onPress={mode === 'signIn' ? onSignIn : mode === 'signUp' ? onSignUp : onConfirm}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {mode === 'signIn' ? 'Ingresar' : mode === 'signUp' ? 'Crear cuenta' : 'Confirmar'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            {mode !== 'signIn' && (
              <TouchableOpacity onPress={() => setMode('signIn')}>
                <Text style={styles.switchLink}>Ya tengo cuenta</Text>
              </TouchableOpacity>
            )}
            {mode === 'signIn' && (
              <TouchableOpacity onPress={() => setMode('signUp')}>
                <Text style={styles.switchLink}>Crear una cuenta</Text>
              </TouchableOpacity>
            )}
            {mode !== 'confirm' && (
              <TouchableOpacity onPress={() => setMode('confirm')}>
                <Text style={styles.switchLink}>Confirmar con código</Text>
              </TouchableOpacity>
            )}
          </View>
        </CardBody>
      </Card>
    </Screen>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={colors.muted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { color: colors.text, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fff',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  switchLink: { color: colors.link },
  error: { color: colors.danger, marginBottom: 10 },
  info: { color: colors.primary, marginBottom: 10 },
});
