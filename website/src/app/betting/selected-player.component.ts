import { Component,  Input, Output, EventEmitter } from "@angular/core";
import { ISelectedPlayer, ITeam, emptyTeam, emptySelectedPlayer } from "../shared/model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pm-selected-player',
  templateUrl: './selected-player.component.html',
  styleUrls: ['./selected-player.component.css']
})
export class SelectedPlayerComponent {

  @Input() mode : string = "EDIT" // EDIT VIEW
  @Input() selectedPlayer : ISelectedPlayer = emptySelectedPlayer();
  @Input() filteredTeam : ITeam = emptyTeam();
  @Input() availableMultipliers : number = NaN;

  constructor(private modalService: NgbModal) {}

  shouldDisplayPlayer( selectedPlayer : ISelectedPlayer ) {
    return  selectedPlayer.playerStats.player.playerId && (
            this.mode === 'EDIT' ||
            (this.mode === 'VIEW' && selectedPlayer.played));
  }

  shouldDisplayPendingSelection( selectedPlayer : ISelectedPlayer ) {
    return  !selectedPlayer.playerStats.player.playerId && 
            this.mode === 'EDIT' ;
  }

  shouldDisplayAvailableMultipliers(){
    return this.mode === 'EDIT' && this.availableMultipliers > 0;
  }

  shouldDisplayPendingResult( selectedPlayer : ISelectedPlayer ) {
    return  this.mode == 'VIEW' && !selectedPlayer.played;
  }

  maximumMultipliersPerPlayer() : number {
    return 3;
  }

  onMultiplierAdded(message: ISelectedPlayer): void {
    message.playerMultiplier = message.playerMultiplier + 1;
    this.playerMultiplierClicked.emit( message );
  }

  confirmSelection(content:any) {
    if( (this.selectedPlayer.playerMultiplier < this.maximumMultipliersPerPlayer()) 
          && (this.availableMultipliers > 0) 
          && !this.selectedPlayer.played ){
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            (result) => {
                if( result === "Accept" ){
                    this.onMultiplierAdded(this.selectedPlayer);
                }
            }
        );
    }
  }

  @Output() 
  playerMultiplierClicked: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();
  
}
