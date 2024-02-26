import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());


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
            case 'GET':
                body = await dynamo.scan({ TableName: 'SaqueGanador-Tournaments' });
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
