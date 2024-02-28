import { Component,  Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { ISelectedPlayer, IUser, emptyUser, ITeam, emptyTeam, emptySelectedPlayer, IMatch } from "../shared/model";
import { photo, photoType} from '../shared/photos';
import { matchHasStarted } from "../shared/utils" ;

@Component({
  selector: 'pm-selected-player',
  templateUrl: './selected-player.component.html',
  styleUrls: ['./selected-player.component.css']
})
export class SelectedPlayerComponent implements OnInit, OnDestroy {

  @Input() mode : string = "EDIT" // EDIT VIEW
  @Input() selectedPlayer : ISelectedPlayer = emptySelectedPlayer();
  @Input() filteredTeam : ITeam = emptyTeam();
  @Input() availableMultipliers : number = NaN;
  @Input() matches : IMatch[] = [];
  @Input() loggedInUser : IUser = emptyUser();

  displayAddMultiplierModal    : boolean = false;
  displayRemoveMultiplierModal : boolean = false;
  displayRemovePlayerModal     : boolean = false;

  photo : string = '';
  photoType : string = '';


  ngOnInit(): void {
    this.photo = photo(this.selectedPlayer.playerStats.player) ;
    this.photoType = photoType(this.selectedPlayer.playerStats.player) ;
  }
  
  ngOnDestroy(): void {
  }

  shouldDisplayPlayer( selectedPlayer : ISelectedPlayer ) {
    return  selectedPlayer.playerStats.player.playerId && (
                this.mode === 'EDIT' ||
                (this.mode === 'VIEW' && !!selectedPlayer.played) ||
                (this.mode === 'VIEW' && this.matchHasStarted(selectedPlayer)) ||
                (this.mode === 'VIEW' && this.teamIsOwnedByLoggedInUser() ) 
            );
  }

  teamIsOwnedByLoggedInUser(){
      return this.filteredTeam && this.filteredTeam.user && this.loggedInUser &&
            (this.filteredTeam.user.userId === this.loggedInUser.userId) ;
  }  

  shouldDisplayPendingSelection( selectedPlayer : ISelectedPlayer ) {
    return  !selectedPlayer.playerStats.player.playerId && 
            this.mode === 'EDIT' ;
  }

  shouldDisplayAvailableMultipliers(){
    return this.mode === 'EDIT' && this.availableMultipliers > 0;
  }

  shouldDisplayPendingResult( selectedPlayer : ISelectedPlayer ) {
    return  this.mode == 'VIEW' && !this.matchHasStarted(selectedPlayer)  && 
            !(this.loggedInUser && (this.filteredTeam.user.userId === this.loggedInUser.userId));
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

  matchHasStarted( player:ISelectedPlayer ) {
    let matchId = player.playerStats.matchId;
    return matchHasStarted(matchId, this.matches);
  }

  playerCanBeRemoved( player: ISelectedPlayer ){
    return this.mode === 'EDIT' && this.shouldDisplayPlayer(player) 
            && !this.matchHasStarted(player) 
            && (!player.pastPick||(player.pastPick && this.availableMultipliers>=1))
            && player.confirmed ;
  }

  playerCanNotBeRemoved( player: ISelectedPlayer ) {
    return (this.mode === 'EDIT') && this.shouldDisplayPlayer(player) &&
            ( 
                this.matchHasStarted(player) 
                || (!!player.pastPick && (this.availableMultipliers<=0) )
                || (!player.confirmed && !player.played)
            );
  }

  playerIsConfirmed( player: ISelectedPlayer ) : boolean {
    return player.confirmed || player.played ;
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
    return 'Quitar a ' + this.selectedPlayer.playerStats.player.playerName +' de mi equipo?';
  }

  penaltyMessage(){
    let msg = '';
    if( this.selectedPlayer.pastPick ){
        msg = msg + 'Esto consumirá una pelotita multiplicadora. '
    }
    return msg;
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
