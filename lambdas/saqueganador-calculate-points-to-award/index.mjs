
import { getMatch, saveMatch } from './repository.mjs';

export const handler = async (event, context, callback) => {
    
    console.log('Triggered calculation of points to award.');
    let successfull = 0;
    
    event.Records.forEach( async (record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));
        try {
          if (record.eventName == 'INSERT' || record.eventName == 'MODIFY' ) {
            console.log('match id -> '+record.dynamodb.NewImage.matchId.S);
            let match = await getMatch(record.dynamodb.NewImage.matchId.S);
            console.log(JSON.stringify(match));

            // if both players are present, set points to be awarded
            if( match.a.player && match.a.player.playerId
                && match.b.player && match.b.player.playerId
                && !match.scoreAssigned.BOOL ){
                    
                console.log('Calculate points for players in match '+JSON.stringify(match));
                    
                match.a.pointsToAward = calculatePointsToAward(match.a.player,match.b.player);
                match.b.pointsToAward = calculatePointsToAward(match.b.player,match.a.player);
                match.scoreAssigned = true;
                
                await saveMatch(match);
                successfull = successfull + 1;
            }
          }
        } catch (err) {
            console.log(err);
        }
    });
    
    console.log('Finished calculation of points to award.');
    callback(null, `Successfully processed ${successfull} / ${event.Records.length} records.`);
};   


export const calculatePointsToAward = (player, opponent) =>  {
    
    let rankingDiff = Math.abs(player.ranking - opponent.ranking);
    let baseScore = 320;
    let minScore = 50;
    let maxScore = 275;
    let avg = 150;

    let pointsToAward = 0 ;

    if( player.ranking <= opponent.ranking ){
        if( (avg - rankingDiff) < minScore ){
            pointsToAward = minScore;
        }
        else if( (avg-rankingDiff) > maxScore ){
            pointsToAward = maxScore;
        } else {
            pointsToAward = avg - rankingDiff;
        }
    } else {
        if( (baseScore - ( avg - rankingDiff ) ) < minScore ){
            pointsToAward = minScore;
        }
        else if( ( baseScore - (avg-rankingDiff) ) > maxScore ){
            pointsToAward = maxScore;
        } else {
            pointsToAward = baseScore - ( avg - rankingDiff );
        }
    }
    
    if( pointsToAward < minScore ){
        pointsToAward = minScore;
    }
    
    if( pointsToAward > maxScore ){
        pointsToAward = maxScore;
    }
    
    return Math.round(pointsToAward);
};
