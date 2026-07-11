import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TENNIS_BALL, EMPTY_BALL } from '@/utils/photos';

interface MultiplierProps {
  multiplier: number;
  maximumMultipliers: number;
  mode: 'VIEW' | 'EDIT';
  disabled?: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

// Renders filled yellow balls (current multiplier) plus empty balls up to the max.
export function Multiplier({
  multiplier,
  maximumMultipliers,
  mode,
  disabled,
  onAdd,
  onRemove,
}: MultiplierProps) {
  const filled = Math.max(0, multiplier || 0);
  const empty = Math.max(0, maximumMultipliers - filled);
  const editable = mode === 'EDIT' && !disabled;

  return (
    <View style={styles.row}>
      {Array.from({ length: filled }).map((_, i) => (
        <TouchableOpacity key={`f-${i}`} disabled={!editable} onPress={onRemove}>
          <Image source={TENNIS_BALL} style={styles.ball} />
        </TouchableOpacity>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <TouchableOpacity key={`e-${i}`} disabled={!editable} onPress={onAdd}>
          <Image source={EMPTY_BALL} style={styles.ball} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginVertical: 6,
  },
  ball: {
    width: 22,
    height: 22,
  },
});
