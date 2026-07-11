import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '@/theme';

export interface SelectOption<T> {
  label: string;
  value: T;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  placeholder?: string;
  style?: object;
}

export function Select<T>({
  options,
  selectedIndex,
  onSelect,
  placeholder = 'Seleccionar…',
  style,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const current = options[selectedIndex];

  return (
    <View style={style}>
      <TouchableOpacity style={styles.control} onPress={() => setOpen(true)}>
        <Text style={styles.controlText} numberOfLines={1}>
          {current ? current.label : placeholder}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.option, index === selectedIndex && styles.optionSelected]}
                  onPress={() => {
                    onSelect(index);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    minWidth: 120,
  },
  controlText: {
    color: colors.text,
    flexShrink: 1,
  },
  caret: {
    color: colors.muted,
    marginLeft: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.lightGreen,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
});
