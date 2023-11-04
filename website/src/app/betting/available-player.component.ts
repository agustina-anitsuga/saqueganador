import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IPlayerStatsPerRound, emptyPlayerStatsPerRound, IPlayer, ITeam, emptyTeam } from "../shared/model";

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

  shouldAllowPlayerAddition( player : IPlayer ){
    return ! this.teamContainsPlayer( player )
            && ! this.leagueQuotaFull( player )
  }

  onPlayerSelected( player : IPlayerStatsPerRound ){
    this.playerClicked.emit( player );
  }

  modalClosed( player : IPlayerStatsPerRound ){
    console.log('modalClosed');
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
