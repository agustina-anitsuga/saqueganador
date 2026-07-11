import { saveTournament, getTournament } from './repository.mjs';

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
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
                
                let roundId = tournament.currentRound;
                console.log('current round '+roundId);
                let nextRoundId = roundId < tournament.finalRound ? roundId + 1 : roundId;
                tournament.currentRound = nextRoundId;
                console.log('next round '+tournament.currentRound);
                
                await saveTournament(tournament);
                body = tournament;
                
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




