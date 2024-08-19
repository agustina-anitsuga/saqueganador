import { IPlayer } from './model';

function isLocalPhotoAvailable( player : IPlayer ){
    return player.playerId === 'christopher-o\'connell'  ;
}

export function photo( player : IPlayer ) : string {
    //console.log('photo for '+player.playerName);
    let ret = player.playerProfilePic;
    if( player.league && player.league.leagueName === 'WTA' ){
        if(!player.playerProfilePic) {
            ret =  './assets/images/tennis-player-wta-icon-green.png';
        } else if ( !player.playerProfilePic.startsWith('.')  ){
            let photoUrl = player.playerProfilePic;
            photoUrl = photoUrl.substring(0,photoUrl.indexOf('?')-1);
            photoUrl = photoUrl + '?width=350&height=254';
            ret = photoUrl;
        }
    } else if( photoType(player) === 'atp' ) {
        if( isLocalPhotoAvailable(player) ){
            ret = './assets/images/players/' + player.playerId + '.png';
        } else {
            ret = './assets/images/tennis-player-atp-icon-green.png';
        }
    }
    //console.log('photo:'+ret)
    return ret;
};

export function photoType( player: IPlayer ) : string {
    let ret = '';
    if( player && player.playerProfilePic ) {
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
    }
    return ret;
}

