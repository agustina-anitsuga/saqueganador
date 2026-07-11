import { savePlayer, getPlayer } from './repository.mjs';
import { getPlayerPosition, getStem } from './keyManager.mjs' ;


let replacements = [
  { matchId: '4-1-wta-1.1.2.2.1.2.2.1', playerId: 'barbora-krejcikova', pic: 'https://photoresources.wtatennis.com/photo-resources/2025/04/14/42a06a1d-f130-4f05-81b4-17f6f36c2897/Krejcikova-Torso_318314.png?width=790&height=740' }, 
  
  ];


export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };


    try {

        for (const player of replacements) {
            console.log('processing player '+ JSON.stringify(player));
            
            // fetch playerand update its pic
            let aPlayer = await getPlayer(player.playerId);
            if( aPlayer ) {
                let message = 'Updating player '+player.playerId+' \'s pic to '+player.pic;
                console.log( message );
                aPlayer.playerProfilePic = player.pic;
                await savePlayer(aPlayer);
            }

            // fetch match from db if exists  
            let key = getStem(player.matchId);
            let match = await getMatch(key);
            
            if( match ){
                let playerToUpdate = await getPlayer(player.playerId);
                if( playerToUpdate ) {
                    
                        let position = await getPlayerPosition(player.matchId);
                        if( position === '1' ){
                            console.log('attempting to replace ' + JSON.stringify(match.a.player) + ' pic with ' + JSON.stringify(player.pic));
                            
                                match.a.player.playerProfilePic = player.pic;
                                
                                console.log('do replace -> '+JSON.stringify(match));
                                await saveMatch(match);
                            
                        } else {
                          console.log('attempting to replace ' + JSON.stringify(match.b.player) + ' pic with ' + JSON.stringify(player.pic));
                            
                          match.b.player.playerProfilePic = player.pic;
                          
                          console.log('do replace -> '+JSON.stringify(match));
                          await saveMatch(match);
                        }
                    
                } else {
                    let message = 'Player '+player.playerId+' does not exists.'
                    console.log( message );
                    throw message;
                }
            } else {
                let message = 'Match '+key+' does not exists.';
                console.log(message);
                throw message;
            }          
        }
        
    } catch (err) {
        statusCode = '500';
        console.log('error caught '+err);
        body = err;
    } finally {
        body = JSON.stringify(body);
    }

    let response = {
        statusCode,
        body,
        headers,
    };

    console.log('response: '+JSON.stringify(response));

    return response; 
};

