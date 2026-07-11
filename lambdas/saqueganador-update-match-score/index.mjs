import { saveTeam, getTournament, getMatch, getTeam, getTeamsInRound, getImpactedTeams } from './repository.mjs';
import { getStem, getNextRoundMatchKey } from './keyManager.mjs';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});



export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  let message = event.Records[0].Sns.Message ;
  let match = JSON.parse(message);
  console.log( 'Received match -> ' + JSON.stringify(match) );
  
  let body = await updateMatchScores( match );
  await updateRanking();
  await updateNextRoundTeams(match);

  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };
  return response;
};

export const updateRanking = async () => {
  console.log('updateRanking');
  let topicArn = 'arn:aws:sns:us-east-1:687400810619:saqueganador-ranking-needs-update';
  let message = 'ranking update required';
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

export const getWinner = (match) => {
  return match.a.won? match.a.player : ( match.b.won ? match.b.player : null ) ;
};

export const getLoser = (match) => {
  return match.a.won? match.b.player : ( match.b.won ? match.a.player : null ) ;
};

export const updateMatchScores = async (match) => {
  let winner = getWinner(match);
  console.log( 'winner -> '+ JSON.stringify(winner));
  let loser = getLoser(match);
  console.log( 'loser -> '+ JSON.stringify(loser));
  let impactedTeams = await getImpactedTeams(match);
  console.log('impactedTeams -> ' + JSON.stringify(impactedTeams) );
  let response = [];
  for( let i=0; i<impactedTeams.length; i++){
      let team = impactedTeams[i];
      let selectedWinner = team.selection.find( (elem) => elem.playerStats.player.playerId === winner.playerId );
      let selectedLoser = team.selection.find( (elem) => elem.playerStats.player.playerId === loser.playerId );
      if( selectedWinner || selectedLoser ){
          console.log('team to be updated -> '+JSON.stringify(team));
          if( selectedWinner ){
            selectedWinner.played = true;
            selectedWinner.playerScore = selectedWinner.playerStats.pointsToAward * selectedWinner.playerMultiplier ;
          }
          if( selectedLoser ){
            selectedLoser.played = true;
            selectedLoser.playerScore = 0 ;
          }
          saveTeam(team);
          response.push(team);
      }
  }
  return response;
};

export const getNextRound = (round, tournament) =>  {
    let roundId = round.roundId;
    let nextRoundId = roundId + 1;
    let nextRound = tournament.rounds.find( (elem) => elem.roundId === nextRoundId );
    return nextRound;
};

export const getNextRoundTeam = async (team,tournament) => {
    let nextRound = getNextRound( team.round, tournament );
    let userId = team.user.userId;
    let nextRoundTeamId = tournament.tournamentId + '-' + nextRound.roundId + '-' + userId ;
    return await getTeam(nextRoundTeamId);
}

export const updateNextRoundTeams = async (match) => {
    
    console.log( 'Begin updateTeams' ); 
    try {
        
        // look up tournament
        let tournament = await getTournament();
        console.log('Tournament -> '+JSON.stringify(tournament));
        
        // look up the next round match
        let nextRound = getNextRound(match.round,tournament);
        if( !nextRound ){
            return;
        }
        
        let nextRoundMatchId = getNextRoundMatchKey(match.matchId,match.tournament,match.round,nextRound);
        let nextRoundMatch = await getMatch(nextRoundMatchId);
        console.log('Next Round -> '+JSON.stringify(nextRound)+' nextRoundMatch -> '+ JSON.stringify(nextRoundMatch) );
        
        // get current round teams    
        let teams = await getTeamsInRound(tournament,match.round);
        for (var team of teams) {
            
            console.log('Analyze team -> '+JSON.stringify(team));
            let nextRoundTeam = await getNextRoundTeam(team,tournament);
            console.log('Analyze next round team -> '+JSON.stringify(nextRoundTeam));
            
            console.log('Analyze team selection -> '+JSON.stringify(team.selection));
            for ( let i = 0; i < team.selection.length ; i = i+1 ){
                var player = team.selection[i];
                console.log('Analyze player -> '+JSON.stringify(player));
                if( player && player.playerStats 
                    && player.playerStats.matchId === match.matchId ){
                    console.log('Analyze whether player should be in nextRoundMatch');
                    if( matchHasWinner(match) ) {
                        console.log('Match has winner');
                        if( playerWonMatch( player, match ) ){
                            console.log('Player won match - keep him in next round team ');
                            if( i < nextRoundTeam.selection.length ) {
                                if( nextRoundTeam.selection[i] 
                                    && nextRoundTeam.selection[i].playerStats 
                                    && nextRoundTeam.selection[i].playerStats.player ){
                                    
                                    console.log('confirm selection');
                                    nextRoundTeam.selection[i].confirmed = true;
                                    
                                    if( matchHasPointsToBeAwarded(nextRoundMatch) ){
                                        console.log('assigning points within loop');
                                        nextRoundTeam.selection[i].playerStats.pointsToAward = 
                                                            pointsToAwardToPlayer(nextRoundMatch,player);
                                    }
                                }
                            }
                        } else {
                            console.log('Player lost match - remove him from next round team');
                            if( i < nextRoundTeam.selection.length ){
                                if( nextRoundTeam.selection[i].playerStats.player.playerId 
                                    === team.selection[i].playerStats.player.playerId ){ 
                                    nextRoundTeam.selection[i] = emptySelection;
                                    nextRoundTeam.selection[i].position = i+1;
                                }
                            }
                        }
                        await saveTeam(nextRoundTeam);
                    }
                }
            }
        }
        
        await updateScoresForTeamsWithMatch(nextRoundMatch,tournament);
    
    } catch ( err ) {
        console.log( 'Error updating teams' + err );   
    }
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
    
export const updateScoresForTeamsWithMatch = async ( match, tournament ) => {
    let teams = await getTeamsInRound(tournament,match.round);
    console.log('updateScoresForTeamsWithMatch -> '+JSON.stringify(match));
    for (var team of teams) {
        console.log('Analyze team -> '+JSON.stringify(team));
        for ( let i = 0; i < team.selection.length ; i = i+1 ){
            var player = team.selection[i];
            console.log('Analyze player -> '+JSON.stringify(player));
            if( player && player.playerStats 
                    && player.playerStats.matchId === match.matchId ){
                console.log('Analyze whether the scores should be updated ');
                if( match.scoreAssigned ){
                    let playerId = team.selection[i].playerStats.player.playerId;
                    console.log('team contains player '+playerId+' so points should be updated');
                    if( match.a.player.playerId === playerId ){
                        team.selection[i].playerStats.pointsToAward = match.a.pointsToAward ;
                        console.log('player is a, assigning -> '+team.selection[i].playerStats.pointsToAward);
                    } else if ( match.b.player.playerId === playerId ){
                        team.selection[i].playerStats.pointsToAward = match.b.pointsToAward ;
                        console.log('player is b, assigning -> '+team.selection[i].playerStats.pointsToAward);
                    }

                }
            }
            await saveTeam(team);
        }
    }
};
    
export const pointsToAwardToPlayer = ( match, player ) => {
     return ( match.a.player.playerId === player.playerStats.player.playerId ) ? 
                match.a.pointsToAward : match.b.pointsToAward ;
};

export const playerWonMatch = ( player, match ) => {
    console.log('check if player '+JSON.stringify(player)+' won match '+JSON.stringify(match) );
    var ret = ( match.a.won && match.a.player.playerId === player.playerStats.player.playerId ) ||
              ( match.b.won && match.b.player.playerId === player.playerStats.player.playerId ) ;
    console.log('playerWonMatch -> ' + ret );
    return ret;
};

export const matchHasPointsToBeAwarded = ( match ) => {
    return match.scoreAssigned;
};

export const matchHasWinner = ( match ) => {
     return match.a.won || match.b.won;
};
