import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const dynamo = DynamoDBDocument.from(client);


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
                let roundId = parseInt( (httpPath === "/")? "1" : httpPath.slice(1) );
                console.log('list-matches roundId => '+roundId);
                if( roundId ){
                    let matches = await dynamo.scan({ TableName: 'SaqueGanador-Matches' });
                    console.log( 'matches -> '+JSON.stringify(matches) );
                    body = [];
                    for( let i= 0 ; i<matches.Items.length; i ++ ){
                        let match = matches.Items[i];
                        if( match.round.roundId === roundId && match.scoreAssigned ){
                            console.log( 'match -> ' + JSON.stringify(match) );
                            if(match.matchId) {
                                match.a.matchId = match.matchId;
                                match.b.matchId = match.matchId;
                            }
                            if(match.a.player && match.a.player.playerId) body.push( match.a );
                            if(match.b.player && match.b.player.playerId) body.push( match.b );
                        }
                    }
                } else {
                    throw new Error(`Get not supported on "${httpPath}"`);
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
