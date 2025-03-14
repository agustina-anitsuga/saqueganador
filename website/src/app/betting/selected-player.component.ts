import { Component,  Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { ISelectedPlayer, IUser, emptyUser, ITeam, ITournament, emptyTeam, emptySelectedPlayer, IMatch, emptyTournament } from "../shared/model";
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
  @Input() tournament: ITournament = emptyTournament();

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
    //return true;
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
    return !this.shouldDisplayPlayer(selectedPlayer);
    //return  ( !selectedPlayer.playerStats.player.playerId && this.mode === 'EDIT' ) 
    //        || (this.mode === 'VIEW' && !this.teamIsOwnedByLoggedInUser());
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

  moveLeft( player: ISelectedPlayer ) {
    if( this.mode === 'EDIT' 
      && this.playerCanBeMoved(player)
      && !!this.playerToLeftOf(player) ) {
        this.playerMovedLeft.emit(player);
    }
  }

  moveRight( player: ISelectedPlayer ) {
    if( this.mode === 'EDIT' 
        && this.playerCanBeMoved(player) 
        && !!this.playerToRightOf(player) ) {
        this.playerMovedRight.emit(player);
    }
  }

  playerIsInLastPosition( player: ISelectedPlayer ) : boolean {
      return player && ( player.position === this.filteredTeam.selection.length || !this.playerToRightOf(player) );
  }

  playerIsInFirstPosition( player: ISelectedPlayer ) : boolean {
      return player && ( player.position === 1 || !this.playerToLeftOf(player) );
  }

  playerToLeftOf( player: ISelectedPlayer ){
      let i = player.position - 2;
      let ret = null;
      for(  ; i>=0; i = i - 1 ){
          let temp = this.filteredTeam.selection[i];
          if( this.playerCanBeMoved(temp) ){
              ret = temp;
              break;
          }
      }
      //console.log('playerToLeftOf -> '+player.playerStats.player.playerName+' is '+JSON.stringify(ret));
      return ret;
  }

  playerToRightOf( player: ISelectedPlayer ){
      let i = player.position;
      let ret = null;
      for(  ; i<this.filteredTeam.selection.length; i = i + 1 ){
          let temp = this.filteredTeam.selection[i];
          if( this.playerCanBeMoved(temp) ){
              ret = temp;
              break;
          }
      }
      //console.log('playerToRightOf -> '+player.playerStats.player.playerName+' is '+JSON.stringify(ret));
      return ret;
  }

  playerCanBeMoved( player: ISelectedPlayer ) : boolean {
      return !!player && !!player.playerStats 
          && !!player.playerStats.player && !!player.playerStats.player.playerId 
          && !player.played
          && player.confirmed;
  }

  getPosition( player: ISelectedPlayer ) : string {
    return player.position ? '' + player.position : '';
  }

  needsNextRoundSelection( player: ISelectedPlayer ) {
    return this.mode === 'EDIT' 
      && this.playerCanBeMoved( player)
      && ( this.currentRoundTeamSize() > this.nextRoundTeamSize() )
  }

  currentRoundTeamSize() : number {
      let round = this.filteredTeam.round;
      let aRound = this.tournament.rounds.find( (r) => r.roundId === round.roundId );
      return aRound? aRound.teamSize : 0;
  }

  nextRoundTeamSize() : number {
      let round = this.filteredTeam.round;
      if( this.tournament.finalRound === round.roundId ){
          return 1000;
      }
      let aRound = this.tournament.rounds.find( (r) => r.roundId === (round.roundId + 1) );
      return aRound? aRound.teamSize : 0;
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
  
  @Output() 
  playerMovedRight: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

  @Output() 
  playerMovedLeft: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();
}
