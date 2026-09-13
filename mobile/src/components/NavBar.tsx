import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { LOGO } from '@/utils/photos';
import { useAuth } from '@/context/AuthContext';
import { useTournament } from '@/context/TournamentContext';

interface NavItem {
  label: string;
  path: string;
}

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { tournament } = useTournament();
  const [open, setOpen] = useState(false);

  const username = user?.username ?? '';
  const isAdmin = tournament.admins?.includes(username);
  const isRoot = tournament.root?.includes(username);

  const items: NavItem[] = [
    { label: 'Ranking', path: '/ranking' },
    { label: 'Equipos', path: '/teams' },
  ];
  if (user) items.push({ label: 'Armar mi equipo', path: '/bet' });
  items.push({ label: 'Cómo jugar', path: '/tutorial' });
  if (isAdmin) items.push({ label: 'Admin', path: '/admin' });
  if (isRoot) items.push({ label: 'Root', path: '/root' });
  if (user) items.push({ label: 'Mi cuenta', path: '/account' });

  const go = (path: string) => {
    setOpen(false);
    router.push(path as never);
  };

  const onAuthPress = () => {
    setOpen(false);
    if (user) {
      signOut();
    } else {
      router.push('/login');
    }
  };

  return (
    <View style={styles.bar}>
      <TouchableOpacity
        onPress={() => router.push('/welcome')}
        style={styles.brand}
        accessibilityLabel="Inicio"
      >
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setOpen((o) => !o)}
        style={styles.hamburger}
        accessibilityLabel="Menú"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.hamburgerIcon}>{open ? '✕' : '☰'}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.menu, { paddingTop: insets.top }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.menuHeader}>
              <View style={styles.brand}>
                <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              </View>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={styles.hamburger}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.hamburgerIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            {tournament.tournamentName ? (
              <TouchableOpacity style={styles.menuItem} onPress={() => go('/welcome')}>
                <Text style={styles.tournamentItem} numberOfLines={1}>
                  {tournament.tournamentName}
                </Text>
              </TouchableOpacity>
            ) : null}
            {items.map((item) => {
              const active = pathname.startsWith(item.path);
              return (
                <TouchableOpacity
                  key={item.path}
                  style={styles.menuItem}
                  onPress={() => go(item.path)}
                >
                  <Text style={[styles.menuText, active && styles.menuTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={[styles.menuItem, styles.authItem]} onPress={onAuthPress}>
              <Text style={styles.authText}>{user ? 'Salir' : 'Ingresar'}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  logo: {
    width: 190,
    height: 34,
  },
  tournamentItem: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 18,
  },
  hamburger: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hamburgerIcon: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  menu: {
    backgroundColor: colors.primary,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  menuText: {
    color: colors.lightGreen,
    fontSize: 17,
    fontWeight: '600',
  },
  menuTextActive: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  authItem: {
    marginTop: 4,
  },
  authText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
