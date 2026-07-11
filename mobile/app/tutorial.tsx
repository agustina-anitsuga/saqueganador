import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { colors } from '@/theme';
import { useTournament } from '@/context/TournamentContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

export default function Tutorial() {
  const router = useRouter();
  const { tournament } = useTournament();
  const name = tournament.tournamentName || 'el torneo';
  const mixed = tournament.activeLeagues > 1;

  return (
    <Screen>
      <Card>
        <CardHeader title="Cómo jugar" />
        <CardBody>
          <Section title="RESUMEN DEL JUEGO">
            - Formá tu equipo para el torneo {name}.{' '}
            <Text style={styles.link} onPress={() => router.push('/bet')}>
              Podés armar tu equipo acá
            </Text>
            {'\n'}- Ganá puntos según el desempeño de tus jugadores en el torneo y no olvides que, a
            veces, el riesgo vale la pena.
          </Section>

          <Section title="SELECCIONA A TU EQUIPO PARA LA PRIMERA RONDA DE LA COMPETENCIA">
            Para cada ronda del torneo hasta los cuartos de final, podrás seleccionar, como máximo, a
            8 miembros en tu equipo (después, a 4 en las semifinales y a 2 en las finales).
            {mixed
              ? ' La igualdad es la regla en este concurso. Siempre que el torneo sea mixto, no podrás incluir a más de 4 hombres o mujeres en tu equipo en cada ronda.'
              : ''}{' '}
            Por defecto, los miembros de tu equipo que ya se hayan clasificado en el torneo pasarán
            automáticamente a jugar en la ronda siguiente (una marca especial te permitirá distinguir
            qué jugadores pasarán automáticamente a jugar en las semifinales y finales).
          </Section>

          <Section title="¡GANA PUNTOS CON CADA VICTORIA!">
            Ganarás puntos con cada victoria de un miembro de tu equipo en la ronda de juego. El
            número de puntos en juego dependerá de la relación favorito-outsider entre los
            adversarios en cada encuentro. Cuanto más apuestes por un outsider, más puntos ganarás.
            ¡Pensa tu estrategia!
          </Section>

          <Section title="APROVECHA LAS PELOTAS AMARILLAS PARA GANAR UN MÁXIMO DE PUNTOS EN LOS PARTIDOS">
            En cada ronda de {name} hasta los cuartos de final, tendrás a tu disposición 10 pelotas
            amarillas que no podrás transferir de una ronda a otra (más 6 pelotas amarillas para las
            semifinales y 3 para las finales). Estas pelotas amarillas te ofrecen dos posibilidades:
            {'\n'}1) Duplicar o triplicar el número de puntos en juego para determinados miembros de
            tu equipo en la ronda.
            {'\n'}2) Sustituir a un miembro de su equipo que ya se haya clasificado para la próxima
            ronda por otro jugador que ya compita en el torneo.
          </Section>

          <Section title="PODES MODIFICAR TU EQUIPO ENTRE RONDAS">
            Como se indica anteriormente, el uso de una pelota amarilla te permitirá sustituir a un
            miembro de tu equipo ya clasificado en el torneo por otro que todavía no forme parte de
            él. La sustitución de un miembro de tu equipo que haya perdido su partido en la ronda
            anterior (incluyendo por retirada o abandono) se efectúa gratuitamente sin tener que usar
            una pelota amarilla. Caso específico para las semifinales y finales del torneo: sólo los
            primeros 4 miembros de tu equipo en los cuartos de final pasarán a las semifinales (y
            luego, los 2 primeros miembros de tu equipo de semifinales pasarán a la final).
          </Section>

          <Section title="PODES VER QUE ELIGIERON TUS RIVALES">
            Desde la sección "Equipos" podés ver qué jugadores están en los equipos de tus rivales.
            Pensá tu estrategia: harán cambios de jugadores de una ronda a la otra? O usarán sus
            pelotas amarillas para intentar sumar más puntos?
          </Section>
        </CardBody>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
    fontSize: 14,
  },
  body: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: colors.link,
    textDecorationLine: 'underline',
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
});
