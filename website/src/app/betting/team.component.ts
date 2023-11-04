import { Component, OnDestroy, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { ISelectedPlayer, ITeam, IUser, IRound, emptyTeam, emptyRound, emptyUser, emptySelectedPlayer } from "../shared/model";
import { ActivatedRoute, Router } from '@angular/router';
import { BettingService } from "./betting.service";

@Component({
  selector: 'pm-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy, OnChanges {

  pageTitle : string = "Equipo de"

  @Input() mode : string = 'VIEW' ; // VIEW, EDIT  
  private _currentUserId = NaN;

  @Input() playerToAdd : ISelectedPlayer = emptySelectedPlayer();

  teams : ITeam[] = [] ;
  filteredTeam: ITeam = emptyTeam();

  rounds : IRound[] = [];
  private _selectedRound : IRound = emptyRound();

  users : IUser[] = [];
  private _selectedUser : IUser = emptyUser();
  
  errorMessage = '';

  subTeam!: Subscription;
  subUsers!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private bettingService: BettingService) {}
  
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
  }

  get selectedRound() : IRound {
    return this._selectedRound;
  }

  currentTeamName() : string {
    return (this.filteredTeam && this.filteredTeam.user)? this.filteredTeam.user.userName : '' ;
  }

  performFilter(user: IUser, round: IRound): ITeam {
    let ret = this.getTeamsByRound(this.getTeamsByUser(this.teams,user),round)[0];
    if(ret && ret.user && ret.round){
      console.log('filtered user:'+ret.user.userId+' round:'+ret.round.roundId);
    }
    this.teamFiltered.emit( ret );
    return ret;
  }

  ngOnInit(): void {
    this._currentUserId = Number(this.route.snapshot.paramMap.get("id"));

    this.subUsers = this.bettingService.getGroupUsers().subscribe({
      next: u => {
        this.users = u;
        this.initializeSelections();
      },
      error: err => this.errorMessage = err
    });

    this.subTeam = this.bettingService.getTeams().subscribe({
      next: t => {
        this.teams = t;
        this.rounds = this.getRounds(t);
        this.initializeSelections();
      },
      error: err => this.errorMessage = err
    });
  }

  initializeSelections(){
      
      this._selectedRound = this.getCurrentRound();
      this.selectedRound = this._selectedRound;
      
      this._selectedUser = this.getCurrentUser();
      this.selectedUser = this._selectedUser ;

      this.filteredTeam = this.performFilter( this._selectedUser, this._selectedRound );
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

  getCurrentUser() : IUser {
      return { "userId": (this._currentUserId?this._currentUserId:1), "userName": "anitsuga" } ; // TODO
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
    return this.deDuplicate( team.map((t: ITeam) => t.round) );
  }

  deDuplicate( rounds : IRound[] ) : IRound[] {
    const ids = rounds.map(({ roundId }) => roundId );
    const filtered = rounds.filter(({ roundId }, index) => !ids.includes(roundId, index + 1));
    return filtered;
  }

  ngOnDestroy(): void {
    this.subTeam.unsubscribe();
    this.subUsers.unsubscribe();
  }

  compareUsers( user1:IUser, user2:IUser ){
    return user1 && user2 && user1.userId === user2.userId;
  }

  shouldDisplayAvailableMultipliers(){
    return this.mode === 'EDIT' && this.availableMultipliers() > 0;
  }

  availableMultipliers() : number {
    let ret = (this.allPlayersSelected() && this.allMatchesPlayed())? 
            0 : ( this.maximumMultipliers() + this.selectedPlayerCount() - this.consumedMultipliers() );
    return ret;
  }

  allMatchesPlayed() {
    return this.filteredTeam.selection.every( player => player.played );
  }

  allPlayersSelected() {
    return this.filteredTeam && this.filteredTeam.selection &&
            this.filteredTeam.selection.every( player => player.playerStats.player.playerId );
  }

  selectedPlayerCount() {
    return ( this.filteredTeam && this.filteredTeam.selection )? 
             this.filteredTeam.selection.reduce( 
              (partialSum, selection) => partialSum + (selection.playerStats.player.playerId? 1:0), 0) : 0;
  }

  maximumMultipliers() : number {
      return 10;
  }

  consumedMultipliers() : number {
      let rta = 0;
      if( this.filteredTeam && this.filteredTeam.selection ){
          for( let i=0; i<this.filteredTeam.selection.length; i++ ){
              rta = rta + (this.filteredTeam.selection[i].playerMultiplier?
                           this.filteredTeam.selection[i].playerMultiplier:0);
          }
      }
      return rta;
  }

  ngOnChanges(): void {
      if( this.playerToAdd.playerStats.player.playerId ){
        let players = this.filteredTeam.selection;
        for (let i = 0; i < players.length; i++) {
            if( !players[i].playerStats.player.playerId ){
              this.filteredTeam.selection[i] = this.playerToAdd;
              this.playerToAdd = emptySelectedPlayer();
              break;
            }
        }
      } 
  }

  playerRemoved( player:ISelectedPlayer ){ 
    let index = this.filteredTeam.selection.findIndex( 
          elem => elem.playerStats.player.playerId === player.playerStats.player.playerId );
    this.filteredTeam.selection[index] = emptySelectedPlayer();
  }  

  @Output() 
  playerMultiplierClicked: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

  @Output() 
  teamFiltered: EventEmitter<ITeam> = new EventEmitter<ITeam>();
  
}
