import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme';

export function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.dev}>
        Desarrollado por: <Text style={styles.anitsuga}>anitsuga</Text>
      </Text>
      <Text style={styles.text}>
        © 2026 Copyright:{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('http://saqueganador.com.ar')}
        >
          saqueganador.com.ar
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
  },
  dev: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 6,
  },
  anitsuga: {
    color: colors.primary,
    fontWeight: '700',
  },
  text: {
    color: colors.muted,
    fontSize: 13,
  },
  link: {
    color: colors.text,
    textDecorationLine: 'underline',
  },
});
