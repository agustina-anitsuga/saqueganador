import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { colors } from '@/theme';
import { IRace } from '@/types/model';
import { getRace } from '@/api/api';
import { logos, pastWinners, morePastWinners, Winner } from '@/utils/logos';

function sortRace(race: IRace[]): IRace[] {
  return [...race].sort((a, b) => {
    const adiff = a.position - b.position;
    if (adiff !== 0) return adiff;
    return a.user.userName.toLowerCase() < b.user.userName.toLowerCase() ? -0.1 : 0.1;
  });
}

function WinnerRow({ item, onPress }: { item: Winner; onPress: () => void }) {
  return (
    <View style={styles.winnerRow}>
      <View style={styles.winnerLogoCell}>
        <Image source={logos[item.logo]} style={styles.winnerLogo} resizeMode="contain" />
      </View>
      <Text style={styles.winnerName}>{item.tournament}</Text>
      <Text style={styles.winnerUser}>{item.winner}</Text>
    </View>
  );
}

export default function Welcome() {
  const router = useRouter();
  const [race, setRace] = useState<IRace[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await getRace();
      setRace(sortRace(r));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const goToTeam = (userId: string) => router.push(`/teams/${userId}` as never);

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <Card>
        <CardHeader title="Bienvenidos" />
        <CardBody>
          <View style={styles.banner}>
            <Text style={styles.dates}>Del 29 de Junio al 12 de Julio</Text>
            <Image source={logos.w1} style={styles.bannerLogo} resizeMode="contain" />
          </View>

          <Text style={styles.sectionTitle}>Ganadores de Torneos Pasados</Text>
          <View style={styles.winnerHeader}>
            <Text style={[styles.winnerHeadCell, styles.winnerLogoCell]}>Torneo</Text>
            <Text style={[styles.winnerHeadCell, styles.winnerName]}> </Text>
            <Text style={[styles.winnerHeadCell, styles.winnerUser]}>Ganador</Text>
          </View>
          {pastWinners.map((w, i) => (
            <WinnerRow key={`w-${i}`} item={w} onPress={() => {}} />
          ))}
          {showMore &&
            morePastWinners.map((w, i) => (
              <WinnerRow key={`m-${i}`} item={w} onPress={() => {}} />
            ))}
          <TouchableOpacity onPress={() => setShowMore((s) => !s)} style={styles.moreBtn}>
            <Text style={styles.moreText}>{showMore ? 'Mostrar menos' : 'Mostrar más'}</Text>
          </TouchableOpacity>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Champions Race 2026" />
        <CardBody>
          {race.length ? (
            <View>
              <View style={styles.raceHeader}>
                <Text style={[styles.raceHeadCell, styles.rPos]}>Posición</Text>
                <Text style={[styles.raceHeadCell, styles.rUser]}>Jugador</Text>
                <Text style={[styles.raceHeadCell, styles.rPts]}>Puntos</Text>
              </View>
              {race.map((r, i) => (
                <View key={`r-${i}`} style={styles.raceRow}>
                  <Text style={styles.rPos}>{r.position}</Text>
                  <TouchableOpacity style={styles.rUser} onPress={() => goToTeam(r.user.userId)}>
                    <Text style={styles.link}>{r.user.userName}</Text>
                  </TouchableOpacity>
                  <Text style={styles.rPts}>{r.points}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.muted}>No hay datos de la carrera todavía.</Text>
          )}
        </CardBody>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dates: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  },
  bannerLogo: {
    width: 150,
    height: 110,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    marginVertical: 8,
    color: colors.text,
  },
  winnerHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 6,
    marginBottom: 4,
  },
  winnerHeadCell: {
    fontWeight: '700',
    color: colors.muted,
    fontSize: 13,
  },
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  winnerLogoCell: {
    width: 70,
  },
  winnerLogo: {
    width: 50,
    height: 46,
  },
  winnerName: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  winnerUser: {
    width: 110,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  moreBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  moreText: {
    color: colors.link,
  },
  devText: {
    textAlign: 'center',
    color: colors.muted,
  },
  anitsuga: {
    textAlign: 'center',
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  raceHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },
  raceHeadCell: {
    fontWeight: '700',
    color: colors.muted,
    fontSize: 13,
  },
  raceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rPos: { width: 70, fontSize: 14, color: colors.text },
  rUser: { flex: 1 },
  rPts: { width: 60, textAlign: 'right', fontSize: 14, color: colors.text },
  link: { color: colors.link, fontSize: 14 },
  muted: { color: colors.muted },
});
