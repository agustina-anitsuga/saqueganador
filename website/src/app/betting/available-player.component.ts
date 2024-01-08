import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IPlayerStatsPerRound, emptyPlayerStatsPerRound, IPlayer, ITeam, emptyTeam, IMatch } from "../shared/model";

@Component({ 
  selector: 'pm-available-player', 
  templateUrl: './available-player.component.html',
  styleUrls: ['./available-player.component.css']
})
export class AvailablePlayerComponent {

  @Input() 
  player : IPlayerStatsPerRound = emptyPlayerStatsPerRound() ;
  
  @Input() 
  team : ITeam = emptyTeam() ;  

  @Input() 
  matches : IMatch[] = [] ;  

  displayModal : boolean = false; 

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

  shouldAllowPlayerAddition( player : IPlayerStatsPerRound ){
    return ! this.teamContainsPlayer( player.player )
            && ! this.leagueQuotaFull( player.player )
            && ! this.matchHasStarted( player )
  }

  matchHasStarted( player : IPlayerStatsPerRound ){
    let matchId = player.matchId;
    let m = this.matches.find((match) => match.matchId === matchId);
    return m && ( ( m.matchStartTime && new Date(m.matchStartTime) <= new Date() ) || this.matchHasWinner(m) );
  }

  matchHasWinner( match : IMatch ){
    return match.a.won || match.b.won ;
  }

  onPlayerSelected( player : IPlayerStatsPerRound ){
    this.playerClicked.emit( player );
    this.modalClosed( player );
  }

  modalClosed( player : IPlayerStatsPerRound ){
    this.displayModal = false;
  }

  confirmSelection() {
    this.displayModal = true;
  }

  modalMessage() {
    return "Agregar a "+this.player.player.playerName+" a mi equipo?";
  }
  
  @Output() 
  playerClicked: EventEmitter<IPlayerStatsPerRound> = new EventEmitter<IPlayerStatsPerRound>();

}
