import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { colors } from '@/theme';
import { IMatch } from '@/types/model';
import { saveMatch } from '@/api/api';

const pad2 = (n: number | string) => String(n).padStart(2, '0');

// Display value shown in the text field: "YYYY-MM-DD HH:mm"
function toInputValue(v: IMatch['matchStartTime']): string {
  if (!v) return '';
  return String(v).replace('T', ' ').slice(0, 16);
}

// Parse a typed value into a Date (local, no timezone shift).
function parseToDate(text: string): Date | null {
  const m = text.trim().replace('T', ' ').match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ ]+(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  return isNaN(d.getTime()) ? null : d;
}

// Canonical value the backend/website expects: "YYYY-MM-DDTHH:mm"
function normalizeCanonical(text: string): string | null {
  const m = text.trim().replace('T', ' ').match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ ]+(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}T${pad2(m[4])}:${m[5]}`;
}

function formatDisplay(d: Date): string {
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  );
}

export function MatchCard({ match }: { match: IMatch }) {
  const [aWon, setAWon] = useState(match.a.won);
  const [bWon, setBWon] = useState(match.b.won);
  const [startTime, setStartTime] = useState(toInputValue(match.matchStartTime));
  const [saving, setSaving] = useState(false);

  // Picker state
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [iosOpen, setIosOpen] = useState(false);
  const [androidMode, setAndroidMode] = useState<null | 'date' | 'time'>(null);

  const toggle = (side: 'a' | 'b') => {
    if (side === 'a') {
      const next = !aWon;
      setAWon(next);
      if (next) setBWon(false);
    } else {
      const next = !bWon;
      setBWon(next);
      if (next) setAWon(false);
    }
  };

  const openPicker = () => {
    setTempDate(parseToDate(startTime) ?? new Date());
    if (Platform.OS === 'ios') setIosOpen(true);
    else setAndroidMode('date');
  };

  const onAndroidChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === 'dismissed' || !selected) {
      setAndroidMode(null);
      return;
    }
    if (androidMode === 'date') {
      setTempDate(selected);
      setAndroidMode('time');
    } else {
      setStartTime(formatDisplay(selected));
      setAndroidMode(null);
    }
  };

  const save = async () => {
    let matchStartTime: string | null = null;
    if (startTime.trim()) {
      const canonical = normalizeCanonical(startTime);
      if (!canonical) {
        Alert.alert(
          'Fecha inválida',
          'Usá el formato AAAA-MM-DD HH:mm (ej. 2026-07-09 22:00) o tocá 📅 para elegirla.',
        );
        return;
      }
      matchStartTime = canonical;
    }
    setSaving(true);
    try {
      const updated: IMatch = {
        ...match,
        a: { ...match.a, won: aWon },
        b: { ...match.b, won: bWon },
        matchStartTime,
      };
      await saveMatch(updated);
      Alert.alert('Guardado', 'Cambios guardados');
    } catch (e: any) {
      Alert.alert('Error', String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.player, aWon && styles.winner]}
          onPress={() => toggle('a')}
        >
          <Text style={styles.name}>{match.a.player.playerName}</Text>
          <Text style={styles.meta}>Ranking: {match.a.player.ranking}</Text>
          <Text style={styles.meta}>Puntos en juego: {match.a.pointsToAward}</Text>
        </TouchableOpacity>

        <View style={styles.middle}>
          <Text style={styles.matchId}>{match.matchId}</Text>
          <Text style={styles.meta}>fecha y hora inicio:</Text>
          <TextInput
            style={styles.input}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="AAAA-MM-DD HH:mm"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.pickBtn} onPress={openPicker}>
            <Text style={styles.pickBtnText}>📅 Elegir fecha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} disabled={saving} onPress={save}>
            <Text style={styles.saveBtnText}>{saving ? '…' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.player, bWon && styles.winner]}
          onPress={() => toggle('b')}
        >
          <Text style={styles.name}>{match.b.player.playerName}</Text>
          <Text style={styles.meta}>Ranking: {match.b.player.ranking}</Text>
          <Text style={styles.meta}>Puntos en juego: {match.b.pointsToAward}</Text>
        </TouchableOpacity>
      </View>

      {/* Android: sequential date then time */}
      {Platform.OS === 'android' && androidMode && (
        <DateTimePicker
          value={tempDate}
          mode={androidMode}
          is24Hour
          display="default"
          onChange={onAndroidChange}
        />
      )}

      {/* iOS: combined datetime in a modal with confirm */}
      {Platform.OS === 'ios' && (
        <Modal visible={iosOpen} transparent animationType="fade">
          <Pressable style={styles.backdrop} onPress={() => setIosOpen(false)}>
            <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="spinner"
                onChange={(_e, d) => d && setTempDate(d)}
              />
              <View style={styles.sheetButtons}>
                <TouchableOpacity onPress={() => setIosOpen(false)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setStartTime(formatDisplay(tempDate));
                    setIosOpen(false);
                  }}
                >
                  <Text style={styles.doneText}>Listo</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  player: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    justifyContent: 'center',
  },
  winner: { backgroundColor: colors.winner, borderColor: colors.primary },
  name: { fontWeight: '700', color: colors.text, fontSize: 13 },
  meta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  middle: { width: 140, paddingHorizontal: 6, justifyContent: 'center' },
  matchId: { fontSize: 11, color: colors.muted, marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
    fontSize: 12,
    color: colors.text,
    marginBottom: 6,
  },
  pickBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 7,
    alignItems: 'center',
    marginBottom: 6,
  },
  pickBtnText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
  },
  sheetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  cancelText: { color: colors.muted, fontSize: 16 },
  doneText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
});
