import { ImageSourcePropType } from 'react-native';
import { IPlayer } from '@/types/model';

// Player photos the app self-hosts are stored by the API as a relative path like
// './assets/images/players/<playerId>.png'. Those same files are served by the
// website, so we resolve them against its host rather than bundling copies here.
const SITE_HOST = 'https://saqueganador.com.ar';

// Static local placeholder assets (React Native requires static require paths)
export const WTA_ICON = require('../../assets/images/tennis-player-wta-icon-green.png');
export const ATP_ICON = require('../../assets/images/tennis-player-atp-icon-green.png');
export const QUESTION_MARK = require('../../assets/images/yellow-question-mark.png');
export const TENNIS_BALL = require('../../assets/images/yellow-tennis-ball.png');
export const EMPTY_BALL = require('../../assets/images/favicon.png');
export const FAVICON = require('../../assets/images/favicon.png');
export const LOGO = require('../../assets/images/logo.png');

export function photoType(player: IPlayer): string {
  let ret = '';
  if (player && player.playerProfilePic) {
    if (player.playerProfilePic.startsWith('.')) {
      ret = 'local';
    } else if (player.league && player.league.leagueName === 'WTA') {
      ret = player.playerProfilePic.includes('.png') ? 'wta-body' : 'wta-face';
    } else {
      ret = player.playerProfilePic.startsWith('https://www.atptour.com/') ? 'atp' : 'atp-espn';
    }
  }
  return ret;
}

// Returns an Image source: a { uri } for remote photos, or a local placeholder require.
export function photo(player: IPlayer): ImageSourcePropType {
  const pic = player.playerProfilePic;
  // Self-hosted photos come as a relative './assets/...' path; serve them from
  // the website rather than a { uri } of the bare path (which RN can't load).
  if (pic && pic.startsWith('.')) {
    return { uri: SITE_HOST + pic.substring(1) };
  }
  if (player.league && player.league.leagueName === 'WTA') {
    if (!pic) {
      return WTA_ICON;
    }
    if (!pic.startsWith('.')) {
      let photoUrl = pic;
      const q = photoUrl.indexOf('?');
      if (q > 0) {
        photoUrl = photoUrl.substring(0, q - 1);
      }
      photoUrl = photoUrl + '?width=350&height=254';
      return { uri: photoUrl };
    }
  } else if (photoType(player) === 'atp') {
    return ATP_ICON;
  }
  if (pic && !pic.startsWith('.')) {
    return { uri: pic };
  }
  // Fallback to league-appropriate placeholder
  return player.league && player.league.leagueName === 'WTA' ? WTA_ICON : ATP_ICON;
}
