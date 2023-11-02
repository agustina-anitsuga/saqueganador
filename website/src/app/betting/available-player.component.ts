import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IPlayerStatsPerRound, emptyPlayerStatsPerRound, IPlayer, ITeam, emptyTeam } from "../shared/model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pm-available-player', 
  templateUrl: './available-player.component.html',
  styleUrls: ['./available-player.component.css']
})
export class AvailablePlayerComponent {

  public pageTitle = 'Jugador';

  @Input() 
  player : IPlayerStatsPerRound = emptyPlayerStatsPerRound() ;
  
  @Input() 
  team : ITeam = emptyTeam() ;  

  constructor(private modalService: NgbModal) {}


  teamContainsPlayer( player : IPlayer ){
    return this.team.selection.find( elem => elem.playerStats.player.playerId === player.playerId );
  }

  leagueQuotaFull( player : IPlayer ){
    let result = false;
    if( player.league.leagueId >= 0  ){
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

  confirmSelection(content:any) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {
              if( result === "Accept" ){
                  this.onPlayerSelected(this.player);
              }
          }
      );
  }

  @Output() 
  playerClicked: EventEmitter<IPlayerStatsPerRound> = new EventEmitter<IPlayerStatsPerRound>();

}
