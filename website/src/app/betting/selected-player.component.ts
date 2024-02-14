import { Component,  Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { ISelectedPlayer, IUser, emptyUser, ITeam, emptyTeam, emptySelectedPlayer, IMatch } from "../shared/model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { photo, photoType} from '../shared/photos';

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

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.photo = photo(this.selectedPlayer.playerStats.player) ;
    this.photoType = photoType(this.selectedPlayer.playerStats.player) ;
  }
  
  ngOnDestroy(): void {
  }

  shouldDisplayPlayer( selectedPlayer : ISelectedPlayer ) {
    return  selectedPlayer.playerStats.player.playerId && (
                this.mode === 'EDIT' ||
                (this.mode === 'VIEW' && selectedPlayer.played) ||
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
    return  this.mode == 'VIEW' && !selectedPlayer.played && 
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
    //if(player.playerStats.player.playerName === 'Arthur Fils') {
    //    console.log('matchHasStarted -> '+JSON.stringify(player));
    //    console.log(JSON.stringify(this.matches));
    //} 
    let matchId = player.playerStats.matchId;
    let m = this.matches.find((match) => match.matchId === matchId);
    //if(player.playerStats.player.playerName === 'Arthur Fils') {  
    //  console.log('match -> ' + JSON.stringify(m));
    //  if(m){
    //    console.log(' newDate-> ' + (new Date(m.matchStartTime))
    //          + ' matchHasStarted -> ' + (new Date(m.matchStartTime) <= new Date()));
    //  }
    //}
    return m && ( ( m.matchStartTime && new Date(m.matchStartTime) <= new Date() ) || this.matchHasWinner(m) ) ; 
  }

  matchHasWinner( match : IMatch ){
    return match.a.won || match.b.won ;
  }

  playerCanBeRemoved( player: ISelectedPlayer ){
    return this.mode === 'EDIT' && this.shouldDisplayPlayer(player) //&& !player.played 
            && !this.matchHasStarted(player);
  }

  playerCanNotBeRemoved( player: ISelectedPlayer ){
    return this.mode === 'EDIT' && this.shouldDisplayPlayer(player) //&& player.played
            && this.matchHasStarted(player);
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
