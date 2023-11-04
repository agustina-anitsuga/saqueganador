import { Component,  Input, Output, EventEmitter } from "@angular/core";
import { ISelectedPlayer, ITeam, emptyTeam, emptySelectedPlayer, emptyPlayerStatsPerRound } from "../shared/model";
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

  displayAddMultiplierModal    : boolean = false;
  displayRemoveMultiplierModal : boolean = false;
  displayRemovePlayerModal     : boolean = false;

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

  onMultiplierAdded(message: any): void {
    this.selectedPlayer.playerMultiplier = this.selectedPlayer.playerMultiplier + 1;
    this.multiplierAdded.emit( message );
    this.modalClosed(null);
  }

  onMultiplierRemoved(message: any): void {
    this.selectedPlayer.playerMultiplier = this.selectedPlayer.playerMultiplier - 1;
    this.multiplierRemoved.emit( message );
    this.modalClosed(null);
  }

  playerCanBeRemoved( player: ISelectedPlayer ){
    return this.mode === 'EDIT' && this.shouldDisplayPlayer(player) && !player.played;
  }

  playerCanNotBeRemoved( player: ISelectedPlayer ){
    return this.mode === 'EDIT' && this.shouldDisplayPlayer(player) && player.played;
  }

  modalClosed( player: any ) {
    this.displayAddMultiplierModal = false;
    this.displayRemoveMultiplierModal = false;
    this.displayRemovePlayerModal = false;
  }

  confirmMultiplierRemoved() {
    if( (this.selectedPlayer.playerMultiplier > 1) 
          && !this.selectedPlayer.played ){
        this.displayRemoveMultiplierModal = true;
    }
  }

  confirmMultiplierAdded() {
    if( (this.selectedPlayer.playerMultiplier < this.maximumMultipliersPerPlayer()) 
          && (this.availableMultipliers > 0) 
          && !this.selectedPlayer.played ){
        this.displayAddMultiplierModal = true;
    }
  }

  confirmPlayerRemoval(){
    this.displayRemovePlayerModal = true;
  }

  addMultiplierMessage(){
    return 'Agregar una pelotita multiplicadora a ' + this.selectedPlayer.playerStats.player.playerName +' ?'
  }

  removeMultiplierMessage(){
    return 'Quitar una pelotita multiplicadora a ' + this.selectedPlayer.playerStats.player.playerName +' ?'
  }

  removePlayerMessage(){
    return 'Quitar a ' + this.selectedPlayer.playerStats.player.playerName +' de mi equipo?'
  }

  onPlayerRemoved( player : any ){
    this.playerRemoved.emit(player);
  }

  @Output() 
  multiplierAdded: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();
  
  @Output() 
  multiplierRemoved: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

  @Output() 
  playerRemoved: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();
  
}
