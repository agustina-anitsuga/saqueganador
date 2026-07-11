import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { TournamentProvider } from '@/context/TournamentContext';
import { NavBar } from '@/components/NavBar';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TournamentProvider>
          <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar style="light" />
            <NavBar />
            <View style={styles.content}>
              <Slot />
            </View>
          </SafeAreaView>
        </TournamentProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
