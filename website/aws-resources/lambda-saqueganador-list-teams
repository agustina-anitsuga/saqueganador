import { DynamoDB } from '@aws-sdk/client-dynamodb';
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
    console.log('Received httpPath:', httpPath);
    
    try {
        switch (httpMethod) {
            case 'GET':
                if( httpPath === "/" ){
                    body = await dynamo.scan({ TableName: 'SaqueGanador-Teams' });
                } 
                else if( httpPath.startsWith("/" ) ) {
                    let userId = httpPath.substring(1);
                    console.log('User ID: '+userId);
                    let temp = await dynamo.scan({ TableName: 'SaqueGanador-Teams' });
                    console.log(JSON.stringify(temp));
                    body = [];
                    for( let i=0 ; i< temp.Items.length ; i ++ ){
                        let team = temp.Items[i];
                        console.log('team -> '+JSON.stringify(team));
                        if( team.user.userId === userId ){
                            body.push(team); // todo: change by proper query
                        }
                    }
                    console.log(JSON.stringify(body));
                } 
                else {
                    throw new Error(`GET not supported`);
                }
                break;
            case 'POST': // this should probably do some security check - I should not be allowed to change someone else's team
                let team = JSON.parse(event.body);
                let teamId = team.teamId;
                if( httpPath === ("/"+teamId) ){
                    console.log(`Update team "${httpPath}"`);
                    await saveTeam(team);
                    body = JSON.stringify(team);
                } else {
                    throw new Error(`Inconsistent teamId in POST "${httpPath}" "${teamId}"`);
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

export const saveTeam = async (team) =>  {
    let ret = null;
    let penalties = team.penaltyMultipliers ? team.penaltyMultipliers : 0;
    console.log('begin saveTeam '+JSON.stringify(team));
    var params = {
        TableName:"SaqueGanador-Teams",
        Key: {
            teamId : team.teamId
        },
        UpdateExpression: "set selection = :aSelection, penaltyMultipliers = :aPenalties",
        ExpressionAttributeValues:{
            ":aSelection":team.selection,
            ":aPenalties":penalties
        },
        ReturnValues:"UPDATED_NEW"
    };
    ret = await dynamo.update(params);
    console.log('end saveTeam '+JSON.stringify(ret));
    
    /*
    console.log('begin saveTeam '+JSON.stringify(team));
    var params = {
          TableName: 'SaqueGanador-Teams',
          Item: team
        };
    ret = await dynamo.put(params);
    console.log('end saveTeam '+JSON.stringify(ret));
    */
    
    return ret;
};