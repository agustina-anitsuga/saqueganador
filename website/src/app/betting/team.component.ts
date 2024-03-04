import { Component, OnDestroy, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { ISelectedPlayer, ITeam, IUser, IRound, ITournament, emptyTeam, emptyRound, emptyUser, emptySelectedPlayer, IMatch, emptyTournament } from "../shared/model";
import { ActivatedRoute, Router } from '@angular/router';
import { BettingService } from "./betting.service";
import { AdminService } from "../admin/admin.service";
import { AuthenticatorService } from '@aws-amplify/ui-angular'
import { deDuplicateRounds } from "../shared/utils";
import { SelectorMatcher } from "@angular/compiler";

@Component({
  selector: 'pm-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy, OnChanges {

  pageTitle : string = "Equipo ";

  @Input() mode : string = 'VIEW' ; // VIEW, EDIT  
  private _currentUserId : string = '';

  @Input() playerToAdd : ISelectedPlayer = emptySelectedPlayer();

  @Input() matches : IMatch[] = [];

  teams : ITeam[] = [] ;
  filteredTeam: ITeam = emptyTeam();

  rounds : IRound[] = [];
  private _selectedRound : IRound = emptyRound();

  users : IUser[] = [];
  private _selectedUser : IUser = emptyUser();

  tournament : ITournament = emptyTournament();

  loggedInUser : IUser = emptyUser();

  errorMessage = '';

  subTeam!: Subscription;
  subMyTeam!: Subscription;
  subUsers!: Subscription;
  subMatches!: Subscription;
  subTournament!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, 
            private bettingService: BettingService, private adminService: AdminService,
            private authenticator: AuthenticatorService) {}
  
  set selectedUser( user: IUser ) {
    this._selectedUser = user;
    this.filteredTeam = this.performFilter(this._selectedUser,this._selectedRound);
  }

  get selectedUser() : IUser {
    return this._selectedUser;
  }

  set selectedRound( round: IRound ) {
    this._selectedRound = round;
    this.filteredTeam = this.performFilter(this._selectedUser,this._selectedRound);
    //console.log('team.component selectedRound -> '+JSON.stringify(round));
  }

  get selectedRound() : IRound {
    return this._selectedRound;
  }

  currentTeamName() : string {
    return (this.filteredTeam && this.filteredTeam.user)? this.filteredTeam.user.userName : '' ;
  }

  performFilter(user: IUser, round: IRound): ITeam {
    //console.log('team.component.performFilter');
    let ret = this.getTeamsByRound(this.getTeamsByUser(this.teams,user),round)[0];
    this.teamFiltered.emit( ret );
    return ret;
  }

  ngOnInit(): void {
    this._currentUserId = "" + this.route.snapshot.paramMap.get("id");

    if( this.mode === 'VIEW' ) {
        this.subUsers = this.bettingService.getGroupUsers().subscribe({
          next: ur => {
            this.users = this.sortUsers(ur.Items);
            this.initializeSelections();
          },
          error: err => this.errorMessage = err
        });

        this.subTeam = this.bettingService.getTeams().subscribe({
          next: t => {
            this.teams = t.Items;
            this.rounds = this.getRounds(this.teams);
            this.initializeSelections();
          },
          error: err => this.errorMessage = err
        });

        this.subMatches = this.adminService.getMatches().subscribe({
          next: matches => {
            this.matches = matches.Items;
          },
          error: err => this.errorMessage = err
        }
      );
    }
    else {
        this.subMyTeam = this.bettingService.getTeamsByUser(this.getCurrentUser()).subscribe({
          next: t => {
            this.teams = t;
            this.rounds = this.getRounds(this.teams);
            this.initializeSelections();
            this.fixPositions();
          },
          error: err => this.errorMessage = err
        });

        this.subTournament = this.bettingService.getCurrentTournament().subscribe({
          next: t => {
            this.tournament = t.Items[0];
          },
          error: err => this.errorMessage = err
        });
    }
    
  }

  fixPositions(){
      for( var i=0; i<this.filteredTeam.selection.length; i = i+1 ) {
          if( this.filteredTeam.selection[i] && !this.filteredTeam.selection[i].position ){
            this.filteredTeam.selection[i].position = i+1;
          }
      }
  }

  initializeSelections(){
      
      this.selectedRound = this.getCurrentRound();
      
      this.selectedUser = this.getCurrentUser();

      this.loggedInUser = this.getLoggedInUser();
      
      this.filteredTeam = this.performFilter( this._selectedUser, this._selectedRound );

  }

  sortUsers( users:IUser[] ){
    return users.sort(function(a, b){
      return a.userName.toLowerCase() < b.userName.toLowerCase() ? -1 : 
        ( a.userName.toLowerCase() > b.userName.toLowerCase() ? 1 : 0 ) });
  }

  shouldDisplayTotalScore(){
    return this.filteredTeam && this.filteredTeam.score>=0;
  }

  shouldAllowTeamSelection(){
    return this.mode === 'VIEW'; 
  }

  getCurrentRound() : IRound {
      return this.rounds? this.rounds[this.rounds.length - 1] : emptyRound() ;
  }

  getLoggedInUser() : IUser {
      let ret = emptyUser();
      if (this.authenticator.user) {
          ret = { "userId": //'63123103-a9e5-40f2-aa73-03458ddd3d37', 
                            this.authenticator.user.getUsername(), 
                  "userName": '' } ; 
      }
      return ret;
  }

  playerLeftOf( player : ISelectedPlayer )  : ISelectedPlayer | null {
      let i = player.position - 2;
      let ret = null;
      for( ; i>=0 ; i = i - 1){
          let temp = this.filteredTeam.selection[i];
          if( this.playerCanBeMoved(temp)){
              ret = temp;
              break;
          }
      }
      console.log('Player to left of '+player.playerStats.player.playerName+' is '+JSON.stringify(ret));
      return ret;
  }

  playerRightOf( player : ISelectedPlayer ) : ISelectedPlayer | null {
      let i = player.position ;
      let ret = null;
      for( ; i<this.filteredTeam.selection.length ; i = i + 1){
          let temp = this.filteredTeam.selection[i];
          if( this.playerCanBeMoved(temp)){
              ret = temp;
              break;
          }
      }
      console.log('Player to right of '+player.playerStats.player.playerName+' is '+JSON.stringify(ret));
      return ret;
  }

  playerCanBeMoved( player: ISelectedPlayer ) : boolean {
    return !!player && !!player.playerStats 
        && !!player.playerStats.player && !!player.playerStats.player.playerId 
        && !player.played
        && player.confirmed;
  } 

  playerMovedLeft( player : ISelectedPlayer ) {
    let left = this.playerLeftOf( player );
    if(left) {
        this.swap(left,player);
    }
  }

  playerMovedRight( player : ISelectedPlayer ) {
    let right = this.playerRightOf( player );
    if(right) {
        this.swap(player,right);
    }
  }

  swap( left : ISelectedPlayer, right : ISelectedPlayer ) {  
      
      let tempL : ISelectedPlayer = JSON.parse(JSON.stringify(left));
      let tempR : ISelectedPlayer = JSON.parse(JSON.stringify(right));

      let positionL = tempL.position;
      let positionR = tempR.position;

      this.filteredTeam.selection[ positionL-1 ] = tempR;
      this.filteredTeam.selection[ positionL-1 ].position = positionL;
      this.filteredTeam.selection[ positionR-1 ] = tempL;
      this.filteredTeam.selection[ positionR-1 ].position = positionR;

      this.saveTeam();
  }

  needsNextRoundSelection() {
    return this.mode === 'EDIT'
      && ( this.currentRoundTeamSize() > this.nextRoundTeamSize() )
  }

  nextRoundSelectioMessage() : string {
    let size = this.nextRoundTeamSize();
    let ret = "Sólo los jugadores en las posiciones 1 a "+size+" pasan a la ronda siguiente.";
    if( size === 1 ){
      ret = "Sólo el jugador en la posición 1 pasa a la ronda siguiente.";
    }
    if( size === 2 ){
      ret = "Sólo los jugadores en las posiciones 1 y 2 pasan a la ronda siguiente.";
    }
    return ret;
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

  getCurrentUser() : IUser {   
      let ret = emptyUser();
      if(this._currentUserId && !(this._currentUserId==="null")){
          // a user was selected using the url parameter
          ret = { "userId": this._currentUserId, "userName": "" } ; 
      } else if (this.authenticator.user) {
          // a user is logged in   
          ret = this.getLoggedInUser(); 
      }
      return ret;
  }

  getTeamsByUser( teams : ITeam[], user : IUser ) :ITeam[] {
    const ret = user? teams.filter((t: ITeam) => t.user.userId === user.userId ) : [];
    return ret;
  }

  getTeamsByRound( teams : ITeam[], round : IRound ) : ITeam[] {
    const ret = round? teams.filter((t: ITeam) => t.round.roundId === round.roundId ) : [];
    return ret;
  }

  getRounds( team : ITeam[] ) : IRound[] {
    return deDuplicateRounds( team.map((t: ITeam) => t.round) );
  }

  ngOnDestroy(): void {
    if(this.subTeam) { this.subTeam.unsubscribe(); }
    if(this.subMyTeam) { this.subMyTeam.unsubscribe(); }
    if(this.subUsers) { this.subUsers.unsubscribe(); }
    if(this.subMatches) { this.subMatches.unsubscribe(); }
    if(this.subTournament) { this.subTournament.unsubscribe(); }
  }

  compareUsers( user1:IUser, user2:IUser ){
    return user1 && user2 && user1.userId === user2.userId;
  }

  shouldDisplayAvailableMultipliers(){
    return this.mode === 'EDIT';
  }

  availableMultipliers() : number {
    let ret = (this.allPlayersSelected() && this.allMatchesPlayed())? 
            0 : ( this.maximumMultipliers() + this.selectedPlayerCount() - this.consumedMultipliers() );
    return ret;
  }

  allMatchesPlayed() {
    return this.filteredTeam.selection.every( player => !!player.played );
  }

  allPlayersSelected() {
    return this.filteredTeam && this.filteredTeam.selection &&
            this.filteredTeam.selection.every( player => player.playerStats.player.playerId );
  }

  selectedPlayerCount() {
    return ( this.filteredTeam && this.filteredTeam.selection )? 
             this.filteredTeam.selection.reduce( 
              (partialSum, item) => partialSum + (!!item.playerStats.player.playerId? 1:0), 0) : 0;
  }

  maximumMultipliers() : number {
      if( !this.filteredTeam || !this.filteredTeam.selection )  return 1;
      return this.filteredTeam.selection.length + ( (this.filteredTeam.selection.length>2)?  2 : 1 );
  }

  consumedMultipliers() : number {
      let rta = 0;
      if( this.filteredTeam && this.filteredTeam.selection ){
          for( let i=0; i<this.filteredTeam.selection.length; i++ ){
              rta = rta + (this.filteredTeam.selection[i].playerMultiplier?
                           this.filteredTeam.selection[i].playerMultiplier:0);
          }
          //console.log('consumedMultipliers-penalties -> '+this.penaltyMultipliers());
          rta = rta + this.penaltyMultipliers();
      }
      return rta;
  }

  penaltyMultipliers(): number {
    return this.filteredTeam ? 
            ( this.filteredTeam.penaltyMultipliers ? this.filteredTeam.penaltyMultipliers : 0 ) : 0 ;  
  }

  ngOnChanges(): void {
      if( this.playerToAdd.playerStats.player.playerId ){
        let players = this.filteredTeam.selection;
        for (let i = 0; i < players.length; i++) {
            if( !players[i].playerStats.player.playerId ){
              this.filteredTeam.selection[i] = this.playerToAdd;
              this.playerToAdd = emptySelectedPlayer();
              this.fixPositions();
              break;
            }
        }
        this.saveTeam();
      } 
  }

  playerRemoved( player:ISelectedPlayer ){ 
    //console.log('playerRemoved -> '+JSON.stringify(player));
    let index = this.filteredTeam.selection.findIndex( 
          elem => elem.playerStats.player.playerId === player.playerStats.player.playerId );
    this.filteredTeam.selection[index] = emptySelectedPlayer();
    if( player.pastPick ){
      let penalties = this.penaltyMultipliers();
      this.filteredTeam.penaltyMultipliers = penalties + 1
    }
    this.saveTeam();
  }  

  maximumPossibleScore(){
    return ( this.filteredTeam && this.filteredTeam.selection )? 
                this.filteredTeam.selection.reduce( 
                    (partialSum, selection) => partialSum + 
                        ( selection ? 
                            ( selection && !!selection.played ? selection.playerScore : 
                                ( selection && selection.playerMultiplier? selection.playerMultiplier : 1 ) * selection.playerStats.pointsToAward
                            ) : 0 
                        ) 
                    , 0) 
                : 0;
  }

  multiplierAdded( player:ISelectedPlayer ){ 
    this.saveTeam();
  }  

  multiplierRemoved( player:ISelectedPlayer ){ 
    this.saveTeam();
  }  

  saveTeam(){
    this.bettingService.saveTeam(this.filteredTeam);
  }

  @Output() 
  teamFiltered: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  
}
