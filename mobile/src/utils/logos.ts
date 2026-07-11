import { ImageSourcePropType } from 'react-native';

export const logos: Record<string, ImageSourcePropType> = {
  ao: require('../../assets/images/tournaments/ao-logo.png'),
  arg: require('../../assets/images/tournaments/arg-logo.png'),
  iw: require('../../assets/images/tournaments/iw-logo.png'),
  rg: require('../../assets/images/tournaments/rg-logo.png'),
  t1: require('../../assets/images/tournaments/t1-logo.png'),
  us: require('../../assets/images/tournaments/us-open1-logo.png'),
  w1: require('../../assets/images/tournaments/w1-logo.png'),
};

export interface Winner {
  logo: keyof typeof logos;
  tournament: string;
  winner: string;
}

export const pastWinners: Winner[] = [
  { logo: 'rg', tournament: 'Roland Garros 2026', winner: 'anitsuga' },
  { logo: 'iw', tournament: 'Indian Wells 2026', winner: 'MartinPV' },
  { logo: 'arg', tournament: 'Argentina Open 2026', winner: 'anitsuga' },
  { logo: 'ao', tournament: 'Australian Open 2026', winner: 'anitsuga' },
  { logo: 'us', tournament: 'US Open 2025', winner: 'anitsuga' },
  { logo: 't1', tournament: 'Toronto & Montreal 2025', winner: 'marcelofioren77' },
  { logo: 'w1', tournament: 'Wimbledon 2025', winner: 'marcelofioren77' },
];

export const morePastWinners: Winner[] = [
  { logo: 'rg', tournament: 'Roland Garros 2025', winner: 'anitsuga' },
  { logo: 'iw', tournament: 'Indian Wells 2025', winner: 'marcelofioren77' },
  { logo: 'arg', tournament: 'Argentina Open 2025', winner: 'Andre' },
  { logo: 'ao', tournament: 'Australian Open 2025', winner: 'anitsuga' },
  { logo: 'us', tournament: 'US Open 2024', winner: 'MartinPV' },
  { logo: 'w1', tournament: 'Wimbledon 2024', winner: 'marcelofioren77' },
  { logo: 'rg', tournament: 'Roland Garros 2024', winner: 'marcelofioren77' },
  { logo: 'iw', tournament: 'Indian Wells 2024', winner: 'anitsuga' },
  { logo: 'arg', tournament: 'Argentina Open 2024', winner: 'Nole_GOAT' },
  { logo: 'ao', tournament: 'Australian Open 2024', winner: 'anitsuga' },
];
