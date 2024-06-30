import { IPlayer } from './model';

function isLocalPhotoAvailable( player : IPlayer ){
    return player.playerId === 'tomas-martin-etcheverry' ||
            player.playerId === 'luciano-darderi' ||
            player.playerId === 'holger-rune' ||
            player.playerId === 'francisco-cerundolo' ||
            player.playerId === 'mariano-navone' ||
            player.playerId === 'luca-nardi' ||
            player.playerId === 'facundo-diaz-acosta' ||
            player.playerId === 'kei-nishikori' ||
            player.playerId === 'paul-jubb' ||
            player.playerId === 'billy-harris' ||
            player.playerId === 'juan-pablo-varillas' ||
            player.playerId === 'dominic-stricker' ||
            player.playerId === 'matteo-arnaldi' ||
            player.playerId === 'arthur-fils' ||
            player.playerId === 'sumit-nagal' ||
            player.playerId === 'yannick-hanfmann' ||
            player.playerId === 'adam-walton' ||
            player.playerId === 'alexandre-muller' ||
            player.playerId === 'pavel-kotov' ||
            player.playerId === 'pedro-martinez' ||
            player.playerId === 'james-duckworth' ||
            player.playerId === 'jack-draper' ||
            player.playerId === 'thiago-seyboth-wild' ||
            player.playerId === 'giovanni-mpetshi-perricard' ||
            player.playerId === 'ben-shelton' ;
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

