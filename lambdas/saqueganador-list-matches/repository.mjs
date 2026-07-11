import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';


const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocument.from(client);

export const getLeague = (key) =>  {
    let ret = { leagueId: 1, leagueName: 'ATP' };
    if( key === 'wta' ){
        ret = { leagueId: 2, leagueName: 'WTA' };
    }
    return ret;
};

export const saveMatch = async (match) =>  {
    let ret = null;
    console.log('begin saveMatch '+JSON.stringify(match));
    try {
        var params = {
          TableName: 'SaqueGanador-Matches',
          Item: match
        };
        ret = await documentClient.put(params);
    } catch (err) {
        console.log('Error saving to dynamo '+err);
    }
    console.log('end saveMatch '+JSON.stringify(ret));
    return ret;
};

export const getTournament= async(key) => {
    let ret = null;
    let tournaments = await documentClient.scan({ TableName: 'SaqueGanador-Tournaments' });
    if( tournaments.Items.length == 1 ){
        ret = tournaments.Items[0];
    }
    console.log('Active tournament:' + JSON.stringify(ret));
    return ret;
};

export const getMatch= async(key) => {
    let match = await documentClient.get({
              TableName: "SaqueGanador-Matches",
              Key: {matchId: key},
            });
    return match.Item;
};

export const getMatches= async() => {
    let matches = await documentClient.scan({ TableName: 'SaqueGanador-Matches' });
    return matches;
};

export const getPlayer= async(key) => {
    let player = await documentClient.get({
              TableName: "SaqueGanador-Players",
              Key: {playerId: key},
            });
    return player.Item;
};


export const getUsers= async() => {
    let users = await documentClient.scan({ TableName: 'SaqueGanador-Users' });
    return users.Items;
};


export const getTeam = async(key) => {
    let team = await documentClient.get({
              TableName: "SaqueGanador-Teams",
              Key: {teamId: key},
            });
    return team.Item;
};


export const getTeams = async() => {
    let teams = await documentClient.scan({ TableName: 'SaqueGanador-Teams' });
    return teams.Items;
};


export const getRanking = async(key) => {
    let ranking = await documentClient.get({
              TableName: "SaqueGanador-Ranking",
              Key: {rankingId: key},
            });
    return ranking.Item;
};



export const saveTeam = async (team) =>  {
    let ret = null;
    console.log('begin saveTeam '+JSON.stringify(team));
    try {
        var params = {
          TableName: 'SaqueGanador-Teams',
          Item: team
        };
        ret = await documentClient.put(params);
    } catch (err) {
        console.log('Error saving to dynamo '+err);
    }
    console.log('end saveTeam '+JSON.stringify(ret));
    return ret;
};

export const saveRanking = async (ranking) =>  {
    let ret = null;
    console.log('begin saveRanking '+JSON.stringify(ranking));
    try {
        var params = {
          TableName: 'SaqueGanador-Ranking',
          Item: ranking
        };
        ret = await documentClient.put(params);
    } catch (err) {
        console.log('Error saving to dynamo '+err);
    }
    console.log('end saveRanking '+JSON.stringify(ret));
    return ret;
};


export const getGlobalRankings = async( pTournamentId ) => {
    const partialKey = pTournamentId + '--';
    console.log('begin getGlobalRankings '+ partialKey );
    const params = {
        TableName: 'SaqueGanador-Ranking',
        ScanFilter: {
           "rankingId": {
                ComparisonOperator: "BEGINS_WITH",
                AttributeValueList: [partialKey]
           }
        }
    };
    let rankings = await documentClient.scan(params);
    console.log('end getGlobalRankings' );
    return rankings.Items;
};


export const getRankingsPerRound = async( pTournamentId, pRoundId ) => {
    const partialKey = pTournamentId + '-' + pRoundId + '-';
    console.log('begin getRankingsPerRound '+ partialKey );
    const params = {
        TableName: 'SaqueGanador-Ranking',
        ScanFilter: {
           "rankingId": {
                ComparisonOperator: "BEGINS_WITH",
                AttributeValueList: [partialKey]
           }
        }
    };
    let rankings = await documentClient.scan(params);
    console.log('end getRankingsPerRound' );
    return rankings.Items;
};


export const getTournamentRanking = async( pTournament ) => {
    const partialKey = pTournament.tournamentId + '--';
    console.log('begin getTournamentRanking '+ partialKey );
    const params = {
        TableName: 'SaqueGanador-Ranking',
        ScanFilter: {
           "rankingId": {
                ComparisonOperator: "BEGINS_WITH",
                AttributeValueList: [partialKey]
           }
        }
    };
    let rankings = await documentClient.scan(params);
    console.log('end getTournamentRanking' );
    return rankings.Items;
  };


export const getRaceItems = async( ) => {
    const partialKey = 'race-a-' ;
    console.log('begin getRaceItems '+ partialKey );
    const params = {
        TableName: 'SaqueGanador-Race',
        ScanFilter: {
           "raceId": {
                ComparisonOperator: "BEGINS_WITH",
                AttributeValueList: [partialKey]
           }
        }
    };
    let rankings = await documentClient.scan(params);
    console.log('end getRaceItems - '+JSON.stringify(rankings.Items) );
    return rankings.Items;
  };
  


export const getRaceDItems = async( ) => {
    const partialKey = 'race-d-' ;
    console.log('begin getRaceItems '+ partialKey );
    const params = {
        TableName: 'SaqueGanador-Race',
        ScanFilter: {
           "raceId": {
                ComparisonOperator: "BEGINS_WITH",
                AttributeValueList: [partialKey]
           }
        }
    };
    let rankings = await documentClient.scan(params);
    console.log('end getRaceItems - '+JSON.stringify(rankings.Items) );
    return rankings.Items;
  };
  
  export const getRaceItemsForUser = async( pUser ) => {
    const partialKey = pUser.userId + '-' ;
    console.log('begin getRaceItemsForUser '+ partialKey );
    const params = {
        TableName: 'SaqueGanador-Race',
        ScanFilter: {
           "raceId": {
                ComparisonOperator: "BEGINS_WITH",
                AttributeValueList: [partialKey]
           }
        }
    };
    let rankings = await documentClient.scan(params);
    console.log('end getRaceItemsForUser - '+JSON.stringify(rankings.Items) );
    return rankings.Items;
  };
  

export const saveRaceItem = async (ranking) =>  {
    let ret = null;
    console.log('begin saveRaceUpdate '+JSON.stringify(ranking));
    try {
        var params = {
          TableName: 'SaqueGanador-Race',
          Item: ranking
        };
        ret = await documentClient.put(params);
    } catch (err) {
        console.log('Error saving to dynamo '+err);
    }
    console.log('end saveRaceUpdate '+JSON.stringify(ret));
    return ret;
};
