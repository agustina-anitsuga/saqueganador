import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { getTournament, getMatch, saveMatch, getMatches } from '../shared/repository.mjs';
import { getStem, getRoundId, getNextRoundMatchKey, getPlayerPosition } from '../shared/keyManager.mjs';

const snsClient = new SNSClient({});


export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    let httpMethod = event.requestContext.http.method;
    let httpPath = event.requestContext.http.path;
    console.log('Received httpMethod:', httpMethod);
    
    try {
        switch (httpMethod) {
            case 'GET':
                if( httpPath === "/" ){
                    // shared getMatches() returns the array; the client expects
                    // the raw scan shape { Items: [...] }, so wrap it back.
                    body = { Items: await getMatches() };
                } else {
                    throw new Error(`Get not supported on "${httpPath}"`);
                }
                break;
            case 'POST':
                console.log( 'Starting POST processing ');
                let match = JSON.parse(event.body);
                console.log( 'match -> ' + JSON.stringify(match) );
                let matchId = match.matchId;
                if( httpPath === ("/"+matchId) ){
                    console.log(`Update match "${httpPath}"`);
                    await saveMatch(match);
                    if( match.a.won || match.b.won ){
                        if( await nextRoundExists(match) ){
                            let tournament = await getTournament();
                            await generateNextRoundMatch(match,tournament);
                        }
                        await notifyMatchScoreAvailable(match);
                    }
                    body = JSON.stringify(match);
                } else {
                    throw new Error(`Inconsistent matchId in POST "${httpPath}" "${matchId}"`);
                }
                break;
            default:
                throw new Error(`Unsupported method "${httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
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

export const nextRoundExists= async(match) => {
    let tournament = await getTournament();
    let roundId = getRoundId( match.matchId );
    return roundId < tournament.finalRound;
};

export const emptyMatch = ( tournament ) => {
  return {
      matchId: '',
      tournament: {
          tournamentId: tournament.tournamentId,
          tournamentName: tournament.tournamentName
      },
      round : null,
      a: {
          player : {},
          pointsToAward: 0  
      },
      b: {
          player : {},
          pointsToAward: 0  
      },
      scoreAssigned: false
    };
};

export const generateNextRoundMatch = async (match,tournament) =>  {
    
    // look up the next round match
    let nextRound = await getNextRound(match.round,tournament);
    let nextRoundMatchId = await getNextRoundMatchKey( match.matchId, match.tournament, match.round, nextRound);
    let nextRoundMatch = await getMatch(nextRoundMatchId);
    
    // create it if it does not exist
    if(!nextRoundMatch) {
        console.log('next round match not found');
        nextRoundMatch = emptyMatch(tournament);
        nextRoundMatch.matchId = nextRoundMatchId;
        nextRoundMatch.round = nextRound;
        console.log('next round match not found -> '+JSON.stringify(nextRoundMatch));
    } else {
        console.log('next round match found -> '+JSON.stringify(nextRoundMatch));
    }
    
    // move winner to next round
    let position = getPlayerPosition(match.matchId);
    console.log('position -> '+position);
    let winner = match.a.won ? match.a.player : match.b.player;
    console.log('winner -> ' + JSON.stringify(winner));
    if( position === '1' ){
        nextRoundMatch.a.player = winner;
    } else {
        nextRoundMatch.b.player = winner;
    }
    console.log('nextRoundMatch -> '+JSON.stringify(nextRoundMatch));
    
    // save
    await saveMatch(nextRoundMatch);
};

export const getNextRound = (round, tournament) =>  {
    let roundId = round.roundId;
    let nextRoundId = roundId + 1;
    let nextRound = tournament.rounds.find( (elem) => elem.roundId === nextRoundId );
    return nextRound;
};

export const notifyMatchScoreAvailable = async (match) =>  {
    let topicArn = 'arn:aws:sns:us-east-1:687400810619:saqueganador-match-result-available';
    let message = JSON.stringify(match);
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


