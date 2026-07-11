
export const getRoundId = (matchKey) =>  {
    let ret = matchKey.slice(matchKey.indexOf('-')+1,matchKey.length);
    ret = ret.slice(0,ret.indexOf('-'));
    console.log('roundId for '+matchKey+' => '+ret);
    return parseInt(ret);
};

export const getStem = (matchKey) =>  {
    let ret = matchKey.slice(0,matchKey.length-2);
    console.log('stem for '+matchKey+' => '+ret);
    return ret;
};

export const getPlayerPosition = (matchKey) =>  {
    let ret = matchKey.slice(-1);
    console.log('position for '+matchKey+' => '+ret);
    return ret;
};

export const getNextRoundMatchKey = ( matchKey, pTournament, pRound, pNextRound ) =>  {
    let pStem = getStem(matchKey);
    let currentRound = pTournament.tournamentId + '-' + pRound.roundId + '-' ;
    let nextRound = pTournament.tournamentId + '-' + pNextRound.roundId + '-' ;
    let ret = pStem.replace( currentRound, nextRound );
    console.log('getNextRoundMatchKey->'+ret);
    return ret;
};