import { IPlayer } from './model';

export function photo( player : IPlayer ) : string {
    //console.log('photo for '+player.playerName);
    let ret = player.playerProfilePic;
    if ( !player.playerProfilePic.startsWith('.') && player.league.leagueName === 'WTA' ){
        let photoUrl = player.playerProfilePic;
        photoUrl = photoUrl.substring(0,photoUrl.indexOf('?')-1);
        photoUrl = photoUrl + '?width=350&height=254';
        ret = photoUrl;
    } else if( photoType(player) === 'atp' ) {
        ret =  './assets/images/tennis-player-atp-icon-green.png';
    }
    //console.log('photo:'+ret)
    return ret;
};

export function photoType( player: IPlayer ) : string {
    let ret = '';
    if ( player.playerProfilePic.startsWith('.') ){
        ret = 'local';
    } 
    else if ( player.league.leagueName === 'WTA' ){
        let photoUrl = player.playerProfilePic;
        if( photoUrl.includes('.png') ){
            ret = 'wta-body';
        } else {
            ret = 'wta-face';
        }
    } else {
        if( player.playerProfilePic.startsWith('https://www.atptour.com/') ){
            ret = 'atp';
        } else {
            ret = 'atp-espn';
        }
    }
    return ret;
}

