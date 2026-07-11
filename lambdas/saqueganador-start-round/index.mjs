import { saveTeam, getTournament, getUsers, getTeam, getMatch } from '../shared/repository.mjs';
import { getStem, getTeamKey, getNextRoundMatchKey } from '../shared/keyManager.mjs';
import { requireAdmin } from '../shared/auth.mjs';


export const handler = async (event) => {
    let teams = [];
    let body;
    let users;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    let httpMethod = event.requestContext.http.method;
    console.log('Received httpMethod:', httpMethod);
    
    try {
        switch (httpMethod) {
            case 'POST':

                let tournament = await getTournament();
                await requireAdmin(event, tournament.admins);
                let round = getNextRound(tournament);
                if( round) {
                    console.log('Started generating round '+round.roundName);
                    users = await getUsers();
                    for (const user of users) {
                        console.log('Started generating round for user '+ JSON.stringify(user));
                        let team = await createTeam( user, tournament, round);
                        teams.push(team);
                        console.log('Finished generating round for user '+user["userName"]);
                    }
                    console.log('Finished generating round '+round.roundName);
                } else {
                    console.log('No round to generate');
                }
                
                break;
            default:
                throw new Error(`Unsupported method "${httpMethod}"`);
        }
    } catch (err) {
        statusCode = err.statusCode ? String(err.statusCode) : '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

export const format = (pTournament) =>  {
    return {
        tournamentId: pTournament.tournamentId,
        tournamentName: pTournament.tournamentName
    };
};

export const createTeam = async (pUser , pTournament, pRound) =>  {
    console.log('begin createTeam '+ JSON.stringify(pUser) );
    let team = null;
    
    try {
        // create the key for the new instances
        let key = await getTeamKey( pUser, pTournament, pRound.roundId );
        console.log('key createTeam '+ key);
    
        // fetch team from db if exists
        team = await getTeam(key);
        console.log('after get '+JSON.stringify(team));
        
        // if it does not, create a new one
        if( !team ){
            console.log('could not find team '+key);
            team = {
                teamId: key,
                user: pUser,
                tournament: format(pTournament), 
                round: pRound, 
                selection: [],
                score: 0
            } ;
        } 
        
        // initialize selection
        if( !team.selection.length ) {
            for( let i=0; i < pRound.teamSize; i++){
                team.selection.push(JSON.parse(JSON.stringify((emptySelection))));
                team.selection[i].position = i+1;
            }
        }
        
        // if there was a previous round, fill in victorious players
        if( pRound.roundId>1 ){
            let previousRoundTeamKey = await getTeamKey( pUser, pTournament, (pRound.roundId-1) );
            console.log('key for team in previous round -> '+ key);
            
            let previousTeam = await getTeam(previousRoundTeamKey);
            console.log('previousTeam -> '+JSON.stringify(previousTeam));
            
            let teamSize = pRound.teamSize;
            if( !teamSize ) { teamSize = 8 }
            
            for( let i=0; i < teamSize; i++){
                try { 
                    console.log( 'previous team selection['+i+'] -> '+JSON.stringify( previousTeam.selection[i] ) );
                    if ( !!previousTeam.selection[i] 
                            && !!previousTeam.selection[i].playerStats 
                            && !!previousTeam.selection[i].playerStats.matchId ) {
                        console.log('find previous round match -> ' + previousTeam.selection[i].playerStats.matchId );
                        let match = await getMatch(previousTeam.selection[i].playerStats.matchId);
                        
                        if ( !team.selection[i].playerStats.player.playerId  // position has not yet been filled in current round
                                && ( ( matchHasWinner(match) && playerWon(previousTeam.selection[i],match) ) || ( !matchHasWinner(match) ) )
                            ) {
                            console.log('preserve player '+previousTeam.selection[i].playerStats.player.playerId);
                                
                            team.selection[i].played = false;
                            team.selection[i].playerMultiplier = 1;
                            team.selection[i].playerScore = 0;
                            team.selection[i].playerStats.matchId = getNextRoundMatchKey(
                                            previousTeam.selection[i].playerStats.matchId,
                                            pTournament,
                                            previousTeam.round,
                                            pRound);
                            team.selection[i].playerStats.player = previousTeam.selection[i].playerStats.player;
                            team.selection[i].playerStats.pointsToAward = 0 ;
                            team.selection[i].pastPick = true;
                            team.selection[i].confirmed = previousTeam.selection[i].played;
                            
                            let match = await getMatch(team.selection[i].playerStats.matchId);
                            console.log( 'match->' + JSON.stringify(match));
                            if(match){
                                if( match.scoreAssigned ){
                                    let playerId = team.selection[i].playerStats.player.playerId;
                                    if( match.a.player.playerId === playerId ){
                                        team.selection[i].playerStats.pointsToAward = match.a.pointsToAward ;
                                    } else if ( match.b.player.playerId === playerId ){
                                        team.selection[i].playerStats.pointsToAward = match.b.pointsToAward ;
                                    }
                                }
                            }
                        }
                    }
                } catch ( err ){
                    console.log(err);
                }
            }
        } 
        
        await saveTeam( team );  
        
    } catch ( err ){
        console.log('error createTeam '+ err);
    }
    
    console.log('end createTeam' );
    return team;
};

export const tournamentStarted = (tournament) =>  {
    return true;
};

export const getNextRound = (tournament) =>  {
    console.log('start getNextRound '+JSON.stringify(tournament));
    let roundId = tournament.currentRound;
    console.log('current round '+roundId);
    let nextRoundId = tournamentStarted(tournament)? roundId + 1 : roundId;
    console.log('next round '+nextRoundId);
    let nextRound = tournament.rounds.find( (elem) => elem.roundId === nextRoundId );
    console.log('end getNextRound '+JSON.stringify(nextRound));
    return nextRound;
};

export const playerWon = (player,match) => {
    let playerId = player.playerStats.player.playerId;
    return ( match.a.won && match.a.player.playerId === playerId ) ||
            ( match.b.won && match.b.player.playerId === playerId ) ;
};

export const matchHasWinner = (match) =>  {
    console.log('matchHasWinner -> '+JSON.stringify(match));
    return match.a.won || match.b.won;
};

export const emptySelection = {
        "position" : 0, 
        "playerStats" : {
            "player": {}, 
            "pointsToAward": null
        },
        "playerMultiplier" : 0,
        "playerScore": 0,
        "played": false
    };





