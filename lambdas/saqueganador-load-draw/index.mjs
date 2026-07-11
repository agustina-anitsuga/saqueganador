import {saveMatch,getTournament,getMatch,getPlayer,getLeague} from './repository.mjs';
import {getRoundId,getStem,getPlayerPosition} from './keyManager.mjs';


export const draw = [
    { matchId: '9-1-wta-1.1.1.1.1.1.1.1' , playerId: 'aryna-sabalenka' },
{ matchId: '9-1-wta-1.1.1.1.1.1.1.2' , playerId: 'teodora-kostovic' },
{ matchId: '9-1-wta-1.1.1.1.1.1.2.1' , playerId: 'oleksandra-oliynykova' },
{ matchId: '9-1-wta-1.1.1.1.1.1.2.2' , playerId: 'mccartney-kessler' },
{ matchId: '9-1-wta-1.1.1.1.1.2.1.1' , playerId: 'jelena-ostapenko' },
{ matchId: '9-1-wta-1.1.1.1.1.2.1.2' , playerId: 'harriet-dart' },
{ matchId: '9-1-wta-1.1.1.1.1.2.2.1' , playerId: 'antonia-ruzic' },
{ matchId: '9-1-wta-1.1.1.1.1.2.2.2' , playerId: 'emma-raducanu' },
{ matchId: '9-1-wta-1.1.1.1.2.1.1.1' , playerId: 'leylah-fernandez' },
{ matchId: '9-1-wta-1.1.1.1.2.1.1.2' , playerId: 'janice-tjen' },
{ matchId: '9-1-wta-1.1.1.1.2.1.2.1' , playerId: 'mimi-xu' },
{ matchId: '9-1-wta-1.1.1.1.2.1.2.2' , playerId: 'daria-kasatkina' },
{ matchId: '9-1-wta-1.1.1.1.2.2.1.1' , playerId: 'anastasia-gasanova' },
{ matchId: '9-1-wta-1.1.1.1.2.2.1.2' , playerId: 'emiliana-arango' },
{ matchId: '9-1-wta-1.1.1.1.2.2.2.1' , playerId: 'elsa-jacquemot' },
{ matchId: '9-1-wta-1.1.1.1.2.2.2.2' , playerId: 'naomi-osaka' },
{ matchId: '9-1-wta-1.1.1.2.1.1.1.1' , playerId: 'karolina-muchova' },
{ matchId: '9-1-wta-1.1.1.2.1.1.1.2' , playerId: 'anastasia-zakharova' },
{ matchId: '9-1-wta-1.1.1.2.1.1.2.1' , playerId: 'bianca-andreescu' },
{ matchId: '9-1-wta-1.1.1.2.1.1.2.2' , playerId: 'shuai-zhang' },
{ matchId: '9-1-wta-1.1.1.2.1.2.1.1' , playerId: 'alycia-parks' },
{ matchId: '9-1-wta-1.1.1.2.1.2.1.2' , playerId: 'alicia-dudeney' },
{ matchId: '9-1-wta-1.1.1.2.1.2.2.1' , playerId: 'mananchaya-sawangkaew' },
{ matchId: '9-1-wta-1.1.1.2.1.2.2.2' , playerId: 'maja-chwalinska' },
{ matchId: '9-1-wta-1.1.1.2.2.1.1.1' , playerId: 'katerina-siniakova' },
{ matchId: '9-1-wta-1.1.1.2.2.1.1.2' , playerId: 'qinwen-zheng' },
{ matchId: '9-1-wta-1.1.1.2.2.1.2.1' , playerId: 'peyton-stearns' },
{ matchId: '9-1-wta-1.1.1.2.2.1.2.2' , playerId: 'nikola-bartunkova' },
{ matchId: '9-1-wta-1.1.1.2.2.2.1.1' , playerId: 'barbora-krejcikova' },
{ matchId: '9-1-wta-1.1.1.2.2.2.1.2' , playerId: 'hannah-klugman' },
{ matchId: '9-1-wta-1.1.1.2.2.2.2.1' , playerId: 'magda-linette' },
{ matchId: '9-1-wta-1.1.1.2.2.2.2.2' , playerId: 'mirra-andreeva' },
{ matchId: '9-1-wta-1.1.2.1.1.1.1.1' , playerId: 'jessica-pegula' },
{ matchId: '9-1-wta-1.1.2.1.1.1.1.2' , playerId: 'darja-vidmanova' },
{ matchId: '9-1-wta-1.1.2.1.1.1.2.1' , playerId: 'sara-sorribes-tormo' },
{ matchId: '9-1-wta-1.1.2.1.1.1.2.2' , playerId: 'victoria-jimenez-kasintseva' },
{ matchId: '9-1-wta-1.1.2.1.1.2.1.1' , playerId: 'dayana-yastremska' },
{ matchId: '9-1-wta-1.1.2.1.1.2.1.2' , playerId: 'aoi-ito' },
{ matchId: '9-1-wta-1.1.2.1.1.2.2.1' , playerId: 'jessica-bouzas-maneiro' },
{ matchId: '9-1-wta-1.1.2.1.1.2.2.2' , playerId: 'anastasia-potapova' },
{ matchId: '9-1-wta-1.1.2.1.2.1.1.1' , playerId: 'ekaterina-alexandrova' },
{ matchId: '9-1-wta-1.1.2.1.2.1.1.2' , playerId: 'panna-udvardy' },
{ matchId: '9-1-wta-1.1.2.1.2.1.2.1' , playerId: 'lanlana-tararudee' },
{ matchId: '9-1-wta-1.1.2.1.2.1.2.2' , playerId: 'lilli-tagger' },
{ matchId: '9-1-wta-1.1.2.1.2.2.1.1' , playerId: 'yulia-putintseva' },
{ matchId: '9-1-wta-1.1.2.1.2.2.1.2' , playerId: 'tatjana-maria' },
{ matchId: '9-1-wta-1.1.2.1.2.2.2.1' , playerId: 'jaqueline-cristian' },
{ matchId: '9-1-wta-1.1.2.1.2.2.2.2' , playerId: 'iva-jovic' },
{ matchId: '9-1-wta-1.1.2.2.1.1.1.1' , playerId: 'belinda-bencic' },
{ matchId: '9-1-wta-1.1.2.2.1.1.1.2' , playerId: 'mika-stojsavljevic' },
{ matchId: '9-1-wta-1.1.2.2.1.1.2.1' , playerId: 'xinyu-wang' },
{ matchId: '9-1-wta-1.1.2.2.1.1.2.2' , playerId: 'elisabetta-cocciaretto' },
{ matchId: '9-1-wta-1.1.2.2.1.2.1.1' , playerId: 'francesca-jones' },
{ matchId: '9-1-wta-1.1.2.2.1.2.1.2' , playerId: 'diane-parry' },
{ matchId: '9-1-wta-1.1.2.2.1.2.2.1' , playerId: 'magdalena-frech' },
{ matchId: '9-1-wta-1.1.2.2.1.2.2.2' , playerId: 'anna-kalinskaya' },
{ matchId: '9-1-wta-1.1.2.2.2.1.1.1' , playerId: 'ann-li' },
{ matchId: '9-1-wta-1.1.2.2.2.1.1.2' , playerId: 'zeynep-sonmez' },
{ matchId: '9-1-wta-1.1.2.2.2.1.2.1' , playerId: 'claire-liu' },
{ matchId: '9-1-wta-1.1.2.2.2.1.2.2' , playerId: 'hanne-vandewinkel' },
{ matchId: '9-1-wta-1.1.2.2.2.2.1.1' , playerId: 'solana-sierra' },
{ matchId: '9-1-wta-1.1.2.2.2.2.1.2' , playerId: 'anna-bondar' },
{ matchId: '9-1-wta-1.1.2.2.2.2.2.1' , playerId: 'tamara-korpatsch' },
{ matchId: '9-1-wta-1.1.2.2.2.2.2.2' , playerId: 'coco-gauff' },
{ matchId: '9-1-wta-1.2.1.1.1.1.1.1' , playerId: 'elina-svitolina' },
{ matchId: '9-1-wta-1.2.1.1.1.1.1.2' , playerId: 'daria-snigur' },
{ matchId: '9-1-wta-1.2.1.1.1.1.2.1' , playerId: 'veronika-erjavec' },
{ matchId: '9-1-wta-1.2.1.1.1.1.2.2' , playerId: 'leolia-jeanjean' },
{ matchId: '9-1-wta-1.2.1.1.1.2.1.1' , playerId: 'ajla-tomljanovic' },
{ matchId: '9-1-wta-1.2.1.1.1.2.1.2' , playerId: 'mariam-bolkvadze' },
{ matchId: '9-1-wta-1.2.1.1.1.2.2.1' , playerId: 'ashlyn-krueger' },
{ matchId: '9-1-wta-1.2.1.1.1.2.2.2' , playerId: 'donna-vekic' },
{ matchId: '9-1-wta-1.2.1.1.2.1.1.1' , playerId: 'emma-navarro' },
{ matchId: '9-1-wta-1.2.1.1.2.1.1.2' , playerId: 'paula-badosa' },
{ matchId: '9-1-wta-1.2.1.1.2.1.2.1' , playerId: 'oksana-selekhmeteva' },
{ matchId: '9-1-wta-1.2.1.1.2.1.2.2' , playerId: 'sinja-kraus' },
{ matchId: '9-1-wta-1.2.1.1.2.2.1.1' , playerId: 'yuliia-starodubtseva' },
{ matchId: '9-1-wta-1.2.1.1.2.2.1.2' , playerId: 'anna-blinkova' },
{ matchId: '9-1-wta-1.2.1.1.2.2.2.1' , playerId: 'nadia-podoroska' },
{ matchId: '9-1-wta-1.2.1.1.2.2.2.2' , playerId: 'marta-kostyuk' },
{ matchId: '9-1-wta-1.2.1.2.1.1.1.1' , playerId: 'jasmine-paolini' },
{ matchId: '9-1-wta-1.2.1.2.1.1.1.2' , playerId: 'robin-montgomery' },
{ matchId: '9-1-wta-1.2.1.2.1.1.2.1' , playerId: 'iryna-shymanovich' },
{ matchId: '9-1-wta-1.2.1.2.1.1.2.2' , playerId: 'viktorija-golubic' },
{ matchId: '9-1-wta-1.2.1.2.1.2.1.1' , playerId: 'anhelina-kalinina' },
{ matchId: '9-1-wta-1.2.1.2.1.2.1.2' , playerId: 'kamilla-rakhimova' },
{ matchId: '9-1-wta-1.2.1.2.1.2.2.1' , playerId: 'maria-sakkari' },
{ matchId: '9-1-wta-1.2.1.2.1.2.2.2' , playerId: 'clara-tauson' },
{ matchId: '9-1-wta-1.2.1.2.2.1.1.1' , playerId: 'alexandra-eala' },
{ matchId: '9-1-wta-1.2.1.2.2.1.1.2' , playerId: 'renata-zarazua' },
{ matchId: '9-1-wta-1.2.1.2.2.1.2.1' , playerId: 'serena-williams' },
{ matchId: '9-1-wta-1.2.1.2.2.1.2.2' , playerId: 'maya-joint' },
{ matchId: '9-1-wta-1.2.1.2.2.2.1.1' , playerId: 'tereza-valentova' },
{ matchId: '9-1-wta-1.2.1.2.2.2.1.2' , playerId: 'karolina-pliskova' },
{ matchId: '9-1-wta-1.2.1.2.2.2.2.1' , playerId: 'taylor-townsend' },
{ matchId: '9-1-wta-1.2.1.2.2.2.2.2' , playerId: 'iga-swiatek' },
{ matchId: '9-1-wta-1.2.2.1.1.1.1.1' , playerId: 'amanda-anisimova' },
{ matchId: '9-1-wta-1.2.2.1.1.1.1.2' , playerId: 'lina-gjorcheska' },
{ matchId: '9-1-wta-1.2.2.1.1.1.2.1' , playerId: 'petra-marcinko' },
{ matchId: '9-1-wta-1.2.2.1.1.1.2.2' , playerId: 'sofia-kenin' },
{ matchId: '9-1-wta-1.2.2.1.1.2.1.1' , playerId: 'irina-camelia-begu' },
{ matchId: '9-1-wta-1.2.2.1.1.2.1.2' , playerId: 'katie-swan' },
{ matchId: '9-1-wta-1.2.2.1.1.2.2.1' , playerId: 'kayla-day' },
{ matchId: '9-1-wta-1.2.2.1.1.2.2.2' , playerId: 'madison-keys' },
{ matchId: '9-1-wta-1.2.2.1.2.1.1.1' , playerId: 'sorana-cirstea' },
{ matchId: '9-1-wta-1.2.2.1.2.1.1.2' , playerId: 'sara-bejlek' },
{ matchId: '9-1-wta-1.2.2.1.2.1.2.1' , playerId: 'kimberly-birrell' },
{ matchId: '9-1-wta-1.2.2.1.2.1.2.2' , playerId: 'alina-korneeva' },
{ matchId: '9-1-wta-1.2.2.1.2.2.1.1' , playerId: 'camila-osorio' },
{ matchId: '9-1-wta-1.2.2.1.2.2.1.2' , playerId: 'simona-waltert' },
{ matchId: '9-1-wta-1.2.2.1.2.2.2.1' , playerId: 'ella-seidel' },
{ matchId: '9-1-wta-1.2.2.1.2.2.2.2' , playerId: 'linda-noskova' },
{ matchId: '9-1-wta-1.2.2.2.1.1.1.1' , playerId: 'diana-shnaider' },
{ matchId: '9-1-wta-1.2.2.2.1.1.1.2' , playerId: 'eva-lys' },
{ matchId: '9-1-wta-1.2.2.2.1.1.2.1' , playerId: 'polina-kudermetova' },
{ matchId: '9-1-wta-1.2.2.2.1.1.2.2' , playerId: 'liudmila-samsonova' },
{ matchId: '9-1-wta-1.2.2.2.1.2.1.1' , playerId: 'katie-boulter' },
{ matchId: '9-1-wta-1.2.2.2.1.2.1.2' , playerId: 'tyra-caterina-grant' },
{ matchId: '9-1-wta-1.2.2.2.1.2.2.1' , playerId: 'talia-gibson' },
{ matchId: '9-1-wta-1.2.2.2.1.2.2.2' , playerId: 'marie-bouzkova' },
{ matchId: '9-1-wta-1.2.2.2.2.1.1.1' , playerId: 'elise-mertens' },
{ matchId: '9-1-wta-1.2.2.2.2.1.1.2' , playerId: 'laura-siegemund' },
{ matchId: '9-1-wta-1.2.2.2.2.1.2.1' , playerId: 'beatriz-haddad-maia' },
{ matchId: '9-1-wta-1.2.2.2.2.1.2.2' , playerId: 'maria-timofeeva' },
{ matchId: '9-1-wta-1.2.2.2.2.2.1.1' , playerId: 'elena-gabriela-ruse' },
{ matchId: '9-1-wta-1.2.2.2.2.2.1.2' , playerId: 'caty-mcnally' },
{ matchId: '9-1-wta-1.2.2.2.2.2.2.1' , playerId: 'lois-boisson' },
{ matchId: '9-1-wta-1.2.2.2.2.2.2.2' , playerId: 'elena-rybakina' }
  ];

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let matches = [];
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        let pTournament = await getTournament();
        console.log('Started generating draw for tournament '+pTournament.tournamentName);
        
        if( pTournament ){
            for (const match of draw) {
                console.log('Started generating match '+ JSON.stringify(match));
                let pRound = getRound(pTournament,getRoundId(match.matchId));
                let match1 = await createMatch( match, pTournament, pRound );
                matches.push(match1);
                console.log('Finished generating match '+ JSON.stringify(match1));
            }
            console.log('Finished generating draw');
        }
        
    } catch (err) {
        console.log('Error generating draw '+err);
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(matches);
    }

    return {
        statusCode,
        body,
        headers,
    };
};


export const getRound = (pTournament,pRoundId) =>  {
    return pTournament.rounds.find((element) => element.roundId === pRoundId);
};

export const format = (pPlayer) =>  {
    let ret = {
        league : getLeague(pPlayer.League),
        playerId: pPlayer.playerId,
        playerName: pPlayer.FullName,
        playerProfilePic: pPlayer.ProfilePicUrl,
        playerProfileUrl: (pPlayer.LeagueProfileUrl ? pPlayer.LeagueProfileUrl : pPlayer.Source),
        ranking: Number(pPlayer.Ranking)
        //winRatio: Number(pPlayer.MatchesWon) / (Number(pPlayer.MatchesWon) + Number(pPlayer.MatchesLost))
    };
    return ret;
};

export const emptyMatch = ( pTournament, pRound ) => {
  return {
      matchId: '',
      tournament: { 
          tournamentId: pTournament.tournamentId,
          tournamentName: pTournament.tournamentName,
          activeLeagues: pTournament.activeLeagues
      },
      round : pRound,
      a: {
          player : {},
          pointsToAward: 0  
      },
      b: {
          player : {},
          pointsToAward: 0  
      },
      scoreAssigned: false
    };
};

export const createMatch = async (pMatch,pTournament,pRound) =>  {
    console.log('begin createMatch '+ JSON.stringify(pMatch) );
    let match = null;
    
    try {
        let key = getStem(pMatch.matchId);
      
        // fetch match from db if exists
        match = await getMatch(key);
        console.log('after get '+JSON.stringify(match));
        
        // if it does not, create a new one
        if( !match ){
            console.log('could not find match '+key);
            match = emptyMatch(pTournament,pRound);
            match.matchId = key;
        } 

        // set the player in the match
        let playerResult = await getPlayer(pMatch.playerId);
        if( playerResult ){
            let position = await getPlayerPosition(pMatch.matchId);
            let player = format(playerResult )
            if( position === '1' ){
                match.a.player = player;
            } else {
                match.b.player = player;
            }
            
        } else {
            console.log('Player not found '+pMatch.playerId);
        }

        match.scoreAssigned = false;
        
        await saveMatch( match );  
        
    } catch ( err ){
        console.log('error createMatch '+ err);
    }
    
    console.log('end createMatch' );
    return match;
};



