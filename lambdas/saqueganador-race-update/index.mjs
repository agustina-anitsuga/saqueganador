import { getTournament, getTournamentRanking, getUsers, getRaceItems, getRaceDItems, getRaceItemsForUser, saveRaceItem } from '../shared/repository.mjs';

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    let tournament = await getTournament();
    let race = [];
    
    try {
        await addRankingUpdateToRace( tournament );

        await processRace();

        await assignPositions();

        await assignDPositions();

    } catch (err) {
        console.log('Error generating race update '+err);
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(race);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

export const assignPositions= async() => {

    console.log('Begin assigning positions');

    let raceItems = await getRaceItems();
    let sortedRaceItems = await sortRaceByPoints(raceItems);
    let position = 0;
    let lastScore = -1;
    for( let i=0; i<sortedRaceItems.length; i++){
        let r = sortedRaceItems[i];
        if( !(r.points === lastScore) ){
            position = position +1;
        }
        r.position = position;
        lastScore = r.points;
        console.log('race item '+ JSON.stringify(r));
        await saveRaceItem(r);
    }
    
    console.log('End assigning positions');
    return raceItems;
}


export const assignDPositions= async() => {

  console.log('Begin assigning D positions');

  let raceItems = await getRaceDItems();
  let sortedRaceItems = await sortRaceByDPoints(raceItems);
  let position = 0;
  let lastScore = -1;
  for( let i=0; i<sortedRaceItems.length; i++){
      let r = sortedRaceItems[i];
      if( !(r.dPoints === lastScore) ){
          position = position +1;
      }
      r.position = position;
      lastScore = r.points;
      console.log('race item '+ JSON.stringify(r));
      await saveRaceItem(r);
  }
  
  console.log('End assigning positions');
  return raceItems;
}

export const sortRaceByPoints = ( rankings ) => {
  console.log('to sort by points '+JSON.stringify(rankings));
  let response = rankings.sort( function(a, b){ 
      if ( a.points < b.points ) {
          return 1;
      } else if ( a.points > b.points ) {
          return -1;
      }
      return 0;
  } );
  console.log('Sorted by points '+JSON.stringify(response));
  return response;
};


export const sortRaceByDPoints = ( rankings ) => {
  console.log('to sort by d points '+JSON.stringify(rankings));
  let response = rankings.sort( function(a, b){ 
      if ( a.dPoints < b.dPoints ) {
          return 1;
      } else if ( a.dPoints > b.dPoints ) {
          return -1;
      }
      return 0;
  } );
  console.log('Sorted by points '+JSON.stringify(response));
  return response;
};

export const processRace = async () => {
    console.log('begin processRace');

    let users = await getUsers();
    console.log('users '+ JSON.stringify(users));

    for (const user of users) {
      let raceItems = await getRaceItemsForUser( user )
      let points = 0
      let dPoints = 0
      for( const raceItem of raceItems ){
        console.log('raceItem '+ JSON.stringify(raceItem));
        points += raceItem.points;
        dPoints += raceItem.dPoints;
      }
      console.log('points '+ points + ' dpoints '+ dPoints);
      let race = {
        raceId: 'race-a-' + user.userId ,
        user: user,
        points: points,
        dPoints: 0
      };
      // generate entry for race
      await saveRaceItem(race);
      let drace = {
        raceId: 'race-d-' + user.userId ,
        user: user,
        dPoints: dPoints,
        points: 0
      };
      // generate entry for race
      await saveRaceItem(drace);
    }

    console.log('end processRace');
}


export const addRankingUpdateToRace = async ( pTournament ) =>  {
    console.log('begin addRankingUpdateToRace '+  JSON.stringify(pTournament));
    
    try {
        // read the ranking for the current tournament
        let rankingList = await getTournamentRanking( pTournament );
            
        for (const ranking of rankingList) {

            let race = {
              raceId: ranking.user.userId + "-" +  pTournament.tournamentId ,
              tournament: pTournament,
              user: ranking.user,
              score: ranking.score,
              position: ranking.position,
              points: getPointsForPosition(ranking.position,ranking.score),
              dPoints: getDPointsForPosition(ranking.position,ranking.score)
            };
            // generate entry for race
            await saveRaceItem(race);
        }
        
    } catch ( err ){
        console.log('error addRankingUpdateToRace '+ err);
    }
    
    console.log('end addRankingUpdateToRace' );
    return pTournament;
};

let pointsPerPosition = [
  [ 2000, 1300, 800, 400, 200, 100, 50, 10 ], //GS
  [ 1000,  650, 400, 200, 100,  50, 30, 10 ], //1000
  [  500,  330, 200, 100,  50,  25,  0,  0 ], //500
  [  250,  165, 100,  50,  25,  13,  0,  0 ], //250
]

let dPointsPerPosition = [
  [ 50, 40, 35, 30, 25, 20, 15, 10 ], //GS
  [ 40, 32, 28, 24, 20, 16, 12, 8  ], //1000
  [ 30, 24, 21, 18, 15, 12,  9, 6  ], //500
  [ 20, 16, 14, 12, 10,  8,  6, 4  ], //250
]

let tournamentType = 0;

export const getPointsForPosition = ( position, score ) => {
  if( position > 8 || score <= 0 )
    return 0;
  return pointsPerPosition[tournamentType][position-1];
};

export const getDPointsForPosition = ( position, score ) => {
  if( position > 8 || score <= 0 )
    return 0;
  return dPointsPerPosition[tournamentType][position-1];
};




