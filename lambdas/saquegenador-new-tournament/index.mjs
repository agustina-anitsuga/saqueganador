import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';


const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocument.from(client);

let tournament = {
    "tournamentId": '3',
    "tournamentName": "Indian Wells",
    "tournamentType": 0,
    "activeLeagues":1,
    "rounds": [
        { 
            "roundId": 1,
            "roundName": "Primera Ronda",
            "sortOrder": 1,
            "teamSize": 8
      },{ 
            "roundId": 2,
            "roundName": "Segunda Ronda",
            "sortOrder": 2,
            "teamSize": 8
      },{ 
            "roundId": 3,
            "roundName": "Tercera Ronda",
            "sortOrder": 3,
            "teamSize": 8
      },{ 
            "roundId": 4,
            "roundName": "Cuarta Ronda",
            "sortOrder": 4,
            "teamSize": 8
      },{ 
            "roundId": 5,
            "roundName": "Cuartos de final",
            "sortOrder": 5,
            "teamSize": 8
      },{ 
            "roundId": 6,
            "roundName": "Semifinales",
            "sortOrder": 6,
            "teamSize": 4
      },{ 
            "roundId": 5,
            "roundName": "Final",
            "sortOrder": 5,
            "teamSize": 2
      }
    ],
    "currentRound": 1,
    "finalRound": 7,
    "admins": [
        '63123103-a9e5-40f2-aa73-03458ddd3d37',        
        'eba5b42e-36da-4f3e-bcd9-a0971ae2dd29', 
        '40ef7a3b-3fe6-4cdb-9cae-69673c63fedb'  
    ]
};

export const handler = async (event) => {
  
  await saveTournament( tournament );
  
  const response = {
    statusCode: 200,
    body: JSON.stringify(tournament),
  };
  return response;
};

export const saveTournament = async (tournament) =>  {
    let ret = null;
    console.log('begin saveTournament '+JSON.stringify(tournament));
    try {
        var params = {
          TableName: 'SaqueGanador-Tournaments',
          Item: tournament
        };
        ret = await documentClient.put(params);
    } catch (err) {
        console.log('Error saving to dynamo '+err);
    }
    console.log('end saveTournament '+JSON.stringify(ret));
    return ret;
};
