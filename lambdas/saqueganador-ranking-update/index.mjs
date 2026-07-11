import {getTeam, getRanking, getUsers, getTournament, getGlobalRankings, getRankingsPerRound, saveTeam, saveRanking } from '../shared/repository.mjs'
import {getGlobalRankingKey, getRoundRankingKey} from '../shared/keyManager.mjs';

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    let ranking = [];
    const headers = {
        'Content-Type': 'application/json',
    };

    let tournament = await getTournament();
    let minRound = 1;
    let maxRound = tournament.currentRound;
    
    try {
        
        ranking = await calculateScores( minRound, maxRound, tournament.tournamentId );
        
        ranking = await calculatePositions( minRound, maxRound, tournament.tournamentId );
        
    } catch (err) {
        console.log('Error generating round '+err);
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(ranking);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

export const calculatePositions = async( minRound, maxRound, tournamentId ) => {
    let ranking = [];
    console.log('Begin Calculating ranking positions');
    for( let roundId = minRound; roundId<=maxRound; roundId++ ){
        console.log('Updating round '+roundId);
        let rankingsPerRound = await getRankingsPerRound( tournamentId, roundId );
        let sortedRankingsPerRound = await sortRankings(rankingsPerRound);
        let position = 0;
        let lastScore = -1;
        for( let i=0; i<sortedRankingsPerRound.length; i++){
            let r = sortedRankingsPerRound[i];
            console.log('Sorted ranking '+JSON.stringify(r));
            if( !(r.score === lastScore) ){
                position = position +1;
            }
            r.position = position;
            lastScore = r.score;
            await saveRanking(r);
            ranking.push(r);
        }
        console.log('calculated ranking positions in round '+roundId+'->'+JSON.stringify(ranking));
    }
    let globalRankings = await getGlobalRankings( tournamentId );
    let sortedGlobalRankings = await sortRankings(globalRankings);
    let position = 0;
    let lastScore = -1;
    for( let i=0; i<sortedGlobalRankings.length; i++){
        let r = sortedGlobalRankings[i];
        if( !(r.score === lastScore) ){
            position = position +1;
        }
        r.position = position;
        lastScore = r.score;
        await saveRanking(r);
        ranking.push(r);
    }
    console.log('calculated global ranking positions ->'+JSON.stringify(ranking));
    
    console.log('End Calculating ranking positions');
    return ranking;
};

export const sortRankings = ( rankings ) => {
    console.log('to sort '+JSON.stringify(rankings));
    let response = rankings.sort( function(a, b){ 
        if ( a.score < b.score ) {
            return 1;
        } else if ( a.score > b.score ) {
            return -1;
        }
        return 0;
    } );
    console.log('Sorted rankings '+JSON.stringify(response));
    return response;
};

export const calculateScores = async( minRound, maxRound, tournamentId ) => {
    console.log('Started calculateScores');
    let ranking = [];
    let users = await getUsers();
    console.log('users '+JSON.stringify(users));
    for (const user of users) {
        console.log('Started calculateScores for user '+ JSON.stringify(user));
        let userGlobalScore = 0;
        let r = null;
        for( let roundId = minRound; roundId<=maxRound; roundId++ ){
          r = await processRanking( user, tournamentId, roundId);
          userGlobalScore += r.score ? r.score : 0;
          ranking.push(r);
        }
        if( r ){
            console.log('before processing global ranking r is '+JSON.stringify(r));
            await processGlobalRanking( user, r.tournament, userGlobalScore );
        }
        console.log('Finished calculateScores for user '+user["userName"]);
    }
    console.log('Finished calculateScores');
    return ranking;
};


export const processGlobalRanking = async (pUser , pTournament, pUserGlobalScore) =>  {
    console.log('begin processGlobalRanking '+ JSON.stringify(pUser) + ' ' + JSON.stringify(pTournament) + ' ' + pUserGlobalScore);

    let ranking = null;
    
    try {
        // create the key for the new instances
        let key = await getGlobalRankingKey( pTournament, pUser );
        console.log('key processGlobalRanking '+ key);
            
        // generate ranking entry
        ranking = getRanking(key);
        if(!ranking.rankingId){
            ranking = {
                rankingId: key,
                tournament: pTournament,
                round: { roundId: null, roundName: '',  sortOrder: 0 },
                user: pUser,
                score: 0,
                position: 0
            };
        }
        ranking.score = pUserGlobalScore;
        await saveRanking( ranking );
        
    } catch ( err ){
        console.log('error processGlobalRanking '+ err);
    }
    
    console.log('end processGlobalRanking' );
    return ranking;
};

export const processRanking = async (pUser , pTournamentId, pRoundId) =>  {
    console.log('begin processRanking '+ JSON.stringify(pUser) );
    let ranking = null;
    
    try {
        // create the key for the new instances
        let key = await getRoundRankingKey( pTournamentId, pRoundId, pUser );
        console.log('key processRanking '+ key);
    
        // fetch team from db if exists
        let team = await getTeam(key);
        if( team ){
            // updatescore in team
            let score = 0; 
            for (const selection of team.selection){
                score += selection.playerScore ? selection.playerScore : 0;
            }
            team.score = score;
            await saveTeam( team );
            
            // generate ranking entry
            ranking = getRanking(key);
            console.log('ranking -> '+JSON.stringify(ranking));
            if(!ranking.rankingId){
                console.log('ranking is null');
                ranking = {
                    rankingId: key,
                    tournament: team.tournament,
                    round: team.round,
                    user: pUser,
                    score: 0,
                    position: 0
                };
            }
            ranking.score = team.score;
            console.log('saving ranking '+JSON.stringify(ranking));
            await saveRanking( ranking );
        } 
        
    } catch ( err ){
        console.log('error processRanking '+ err);
    }
    
    console.log('end processRanking' );
    return ranking;
};
