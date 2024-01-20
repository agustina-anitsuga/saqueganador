import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { IPlayerStatsPerRound, ISelectedPlayer, emptyMatchPlayer, emptyMatch, IPlayer, ITeam, emptyTeam, IMatch, IMatchPlayer } from "../shared/model";
import { photo, photoType} from '../shared/photos';

@Component({ 
  selector: 'pm-available-player', 
  templateUrl: './available-player.component.html',
  styleUrls: ['./available-player.component.css']
})
export class AvailablePlayerComponent implements OnInit, OnDestroy {

  @Input() 
  player : IMatchPlayer = emptyMatchPlayer() ;
  
  @Input() 
  match : IMatch = emptyMatch() ;

  @Input() 
  team : ITeam = emptyTeam() ;  

  @Input() 
  matches : IMatch[] = [] ;  

  displayModal : boolean = false; 
  photo : string = '';
  photoType : string = '';

  ngOnInit(): void {
    this.photo = photo(this.player.player) ;
    this.photoType = photoType(this.player.player) ;
  }
  
  ngOnDestroy(): void {
  }

  teamContainsPlayer( player : IPlayer ){
    return (player && this.team && this.team.selection)?  
            this.team.selection.find( elem => 
              (elem.playerStats && elem.playerStats.player)? 
              elem.playerStats.player.playerId === player.playerId : false ) : false ;
  }

  leagueQuotaFull( player : IPlayer ){
    let result = false;
    if( ( player.league.leagueId >= 0) && this.team && this.team.selection ){
        let quota = this.team.selection.length / 2 ;
        let selectedPlayers = this.team.selection.filter( elem => elem.playerStats.player.playerId ); 
        let leaguePlayers = selectedPlayers.filter( elem => 
                      elem.playerStats.player.league.leagueId === player.league.leagueId );
        result = ( leaguePlayers.length >= quota );
    }
    return result;
  }

  shouldAllowPlayerAddition( match : IMatch, player : IMatchPlayer ){
    return ! this.teamContainsPlayer( player.player )
            && ! this.leagueQuotaFull( player.player )
            && ! this.matchHasStarted( match )
  }

  matchHasStarted( match : IMatch ){
    let matchId = match.matchId;
    let m = this.matches.find((match) => match.matchId === matchId);
    return m && ( ( m.matchStartTime && new Date(m.matchStartTime) <= new Date() ) || this.matchHasWinner(m) );
  }

  matchHasWinner( match : IMatch ){
    return match.a.won || match.b.won ;
  }

  onPlayerSelected( player : IMatchPlayer ){
    //console.log('onPlayerSelected -> '+this.match.matchId);
    let playerStats : IPlayerStatsPerRound = {
      player : player.player,
      pointsToAward: player.pointsToAward,  
      matchId: this.match.matchId
    };
    let selectedPlayer : ISelectedPlayer = {
      position : 0,
      playerStats : playerStats,
      playerMultiplier: 1,
      playerScore: 0,
      played: false
    };
    this.playerClicked.emit( selectedPlayer );
    this.modalClosed( player );
  }

  modalClosed( player : IMatchPlayer ){
    this.displayModal = false;
  }

  confirmSelection() {
    this.displayModal = true;
  }

  modalMessage() {
    return "Agregar a "+this.player.player.playerName+" a mi equipo?";
  }
  
  @Output() 
  playerClicked: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

}
