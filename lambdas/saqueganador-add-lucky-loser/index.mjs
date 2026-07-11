import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { getStem, getPlayerPosition } from '../shared/keyManager.mjs';
import { getMatch, saveMatch, getPlayer, getTeams, getTournament } from '../shared/repository.mjs';
import { requireAdmin } from '../shared/auth.mjs';

const snsClient = new SNSClient({});

let replacements = [];

// Parse a request body safely: bounded size, clear error, no raw-event logging
// (the event carries the caller's Authorization token, which must not be logged).
function parseBody(event, maxBytes = 64 * 1024) {
    const raw = event.body || '';
    if (raw.length > maxBytes) {
        const e = new Error('Payload too large'); e.statusCode = 413; throw e;
    }
    try {
        return JSON.parse(raw);
    } catch {
        const e = new Error('Invalid JSON body'); e.statusCode = 400; throw e;
    }
}

export const handler = async (event) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };


    let httpMethod = event.requestContext.http.method;
    let httpPath = event.requestContext.http.path;
    console.log('Received httpMethod:', httpMethod);
    console.log('Received httpPath:', httpPath);

    try {
        switch (httpMethod) {
            case 'POST':
                let tournament = await getTournament();
                await requireAdmin(event, tournament.admins);
                let postLuckyLoser = parseBody(event);
                if( !postLuckyLoser || typeof postLuckyLoser.matchPlayerId !== 'string'
                    || typeof postLuckyLoser.playerId !== 'string' ){
                    const e = new Error('Invalid lucky-loser payload'); e.statusCode = 400; throw e;
                }

                replacements = [
                    { matchId: postLuckyLoser.matchPlayerId , playerId: postLuckyLoser.playerId }
                ];

                console.log('Replacements:',JSON.stringify(replacements));

                //break;

            case 'GETA':
                        
                for (const luckyloser of replacements) {
                    console.log('processing lucky loser '+ JSON.stringify(luckyloser));
                    
                    // fetch match from db if exists  
                    let key = await getStem(luckyloser.matchId);
                    let match = await getMatch(key);
                    
                    if( match ){
                        let llPlayer = await getPlayer(luckyloser.playerId);
                        if( llPlayer ) {
                            let teamsWithPlayerBeingRemoved = await teamsContainingPlayer( match.a.player.playerId );
                            let teamsWithRemainingPlayer= await teamsContainingPlayer( match.b.player.playerId );
                            
                            /*
                            if ( teamsWithPlayerBeingRemoved.length || teamsWithRemainingPlayer.length ) {
                                
                                let message = 'Found player '+ match.a.player.playerId +' or ' + match.b.player.playerId+' in teams ';
                                console.log( message );
                                throw message;
                            } else {
                               */
                                    
                                let position = await getPlayerPosition(luckyloser.matchId);

                                if( position === '1' ){
                                    console.log('attempting to replace ' + JSON.stringify(match.a.player) + ' with ' + JSON.stringify(llPlayer));
                                    if( match.a.player.playerId != llPlayer.playerId ){
                                        match.scoreAssigned = false;
                                        match.a.pointsToAward = 0;
                                        match.b.pointsToAward = 0;
                                        match.a.player.playerName = llPlayer.FullName;
                                        match.a.player.playerProfileUrl = llPlayer.LeagueProfileUrl;
                                        match.a.player.playerProfilePic = llPlayer.ProfilePicUrl;
                                        match.a.player.ranking = llPlayer.Ranking;
                                        match.a.player.playerId = llPlayer.playerId;
                                        console.log('do replace -> '+JSON.stringify(match));
                                        await saveMatch(match);
                                    }
                                } else {
                                    console.log('attempting to replace ' + JSON.stringify(match.b.player) + ' with ' + JSON.stringify(llPlayer));
                                    if( match.b.player.playerId != llPlayer.playerId ){
                                        match.scoreAssigned = false;
                                        match.a.pointsToAward = 0;
                                        match.b.pointsToAward = 0;
                                        match.b.player.playerName = llPlayer.FullName;
                                        match.b.player.playerProfileUrl = llPlayer.LeagueProfileUrl;
                                        match.b.player.playerProfilePic = llPlayer.ProfilePicUrl;
                                        match.b.player.ranking = llPlayer.Ranking;
                                        match.b.player.playerId = llPlayer.playerId;
                                        console.log('do replace -> '+JSON.stringify(match));
                                        await saveMatch(match);
                                    }
                                }
                            //}
                        } else {
                            let message = 'Player '+luckyloser.playerId+' does not exists.'
                            console.log( message );
                            throw message;
                        }
                    } else {
                        let message = 'Match '+key+' does not exists.';
                        console.log(message);
                        throw message;
                    }          
                }
        }
        
    } catch (err) {
        statusCode = err.statusCode ? String(err.statusCode) : '500';
        console.log('error caught '+err);
        body = err.message || err;
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


export const notifyRemovedPlayerSelecedInTeam = async (team) =>  {
    let topicArn = 'arn:aws:sns:us-east-1:687400810619:saqueganador-removed-player-in-team';
    let message = JSON.stringify(team);
    try {
    const response = await snsClient.send(
        new PublishCommand({
          Message: message,
          TopicArn: topicArn,
        }),
    );
    console.log(response);
    } catch ( err ) {
        console.log( err );
    }
};


export const teamsContainingPlayer = async( playerId) => {
    let temp = await getTeams();
    console.log('Teams -> '+JSON.stringify(temp));
    let teams = [];
    for( let i=0 ; i< temp.length ; i ++ ){
        let team = temp[i];
        //console.log('Analyzing team '+JSON.stringify(team));
        for( const selection of team.selection ){
            //console.log('Comparing selection -> '+JSON.stringify(selection));
            if( selection.playerStats.player.playerId === playerId ){
                teams.push(team); 
                console.log('Found player '+playerId+' in team '+JSON.stringify(team));
                break;
            }
        }
    }
    console.log('Teams containing player '+playerId+' -> '+JSON.stringify(teams));
    return teams;
}