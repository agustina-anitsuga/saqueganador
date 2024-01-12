import { Component,  Input, Output, EventEmitter } from "@angular/core";
import { ISelectedPlayer, ITeam, emptyTeam, emptySelectedPlayer, IMatch } from "../shared/model";
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
  @Input() matches : IMatch[] = [];

  displayAddMultiplierModal    : boolean = false;
  displayRemoveMultiplierModal : boolean = false;
  displayRemovePlayerModal     : boolean = false;

  constructor(private modalService: NgbModal) {}

  photo() {
    let player = this.selectedPlayer.playerStats.player;
    let ret = player.playerProfilePic;
    if ( !player.playerProfilePic.startsWith('.') && player.league.leagueName === 'WTA' ){
        let photoUrl = player.playerProfilePic;
        photoUrl = photoUrl.substring(0,photoUrl.indexOf('?')-1);
        photoUrl = photoUrl + '?width=350&height=254';
        ret = photoUrl;
    } else if( this.photoType() === 'atp' ) {
        ret =  './assets/images/tennis-player-atp-icon-green.png';
    }
    console.log('photo:'+ret)
    return ret;
  }

  photoType() {
    let ret = '';
    let player = this.selectedPlayer.playerStats.player;
    if ( player.playerProfilePic.startsWith('.') ){
        ret = 'local';
    } 
    else if ( player.league.leagueName === 'WTA' ){
        let photoUrl = player.playerProfilePic;
        if( photoUrl.includes('.png') ){
            ret = 'wta-body';
        } else {
            ret = 'wta-face';
        }
    } else {
        if( player.playerProfilePic.startsWith('https://www.atptour.com/') ){
          ret = 'atp';
        } else {
          ret = 'atp-espn';
        }
    }
    return ret;
  }

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

  matchHasStarted( player:ISelectedPlayer ) {
    //console.log('matchHasStarted -> '+JSON.stringify(player));
    let matchId = player.playerStats.matchId;
    let m = this.matches.find((match) => match.matchId === matchId);
    //console.log('match -> '+JSON.stringify(m));
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
