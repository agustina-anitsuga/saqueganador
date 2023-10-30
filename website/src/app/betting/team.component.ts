import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { ISelectedPlayer, ITeam, IUser } from "../shared/model";
import { ActivatedRoute, Router } from '@angular/router';
import { IRound } from "../shared/model";
import { BettingService } from "./betting.service";

@Component({
  selector: 'pm-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy {

  public pageTitle :string = 'Equipo de';

  @Input() mode : string = 'VIEW' ; // VIEW, EDIT  
  private _currentUserId = NaN;

  teams : ITeam[] = [] ;
  filteredTeam: ITeam = this.emptyTeam();

  rounds : IRound[] = [];
  private _selectedRound : IRound = { roundId : NaN, roundName : '' };

  users : IUser[] = [];
  private _selectedUser : IUser = { userId : NaN, userName: '' };
  
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

  emptyTeam() : ITeam {
    return { 
      user: { userId: NaN, userName: ''},
      tournament: { tournamentId: NaN, tournamentName: '', currentRound: { roundId: NaN, roundName: ''} }, 
      round: { roundId: NaN, roundName: ''}, 
      selection: [],
      score: NaN } ;
  }

  currentTeamName() : string {
      return (this.filteredTeam && this.filteredTeam.user)? this.filteredTeam.user.userName : '' ;
  }

  allMatchesPlayed() {
      return this.filteredTeam.selection.every( player => player.played );
  }

  maximumMultipliers() : number {
      return 10;
  }

  availableMultipliers() : number {
      return this.allMatchesPlayed()? 0 : ( this.maximumMultipliers() - this.consumedMultipliers() );
  }

  consumedMultipliers() : number {
      return this.filteredTeam.selection.reduce((partialSum, selection) => partialSum + selection.playerMultiplier, 0);
  }

  performFilter(user: IUser, round: IRound): ITeam {
    console.log('perform filter');
    let ret = this.getTeamsByRound(this.getTeamsByUser(this.teams,user),round)[0];
    if(ret && ret.user && ret.round){
      console.log('filtered user:'+ret.user.userId+' round:'+ret.round.roundId);
    }
    return ret;
  }

  ngOnInit(): void {
    console.log('In OnInit');

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
      console.log('initializeSelections');

      this._selectedRound = this.getCurrentRound();
      this.selectedRound = this._selectedRound;
      
      this._selectedUser = this.getCurrentUser();
      this.selectedUser = this._selectedUser ;

      this.filteredTeam = this.performFilter( this._selectedUser, this._selectedRound );
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
    return this.mode === 'EDIT' && this.availableMultipliers() > 0;
  }

  shouldDisplayPendingResult( selectedPlayer : ISelectedPlayer ) {
    return  this.mode == 'VIEW' && !selectedPlayer.played;
  }

  shouldDisplayTotalScore(){
    return this.filteredTeam && this.filteredTeam.score>=0;
  }

  shouldAllowTeamSelection(){
    return this.mode === 'VIEW'; 
  }

  getCurrentRound() : IRound {
      return this.rounds? this.rounds[this.rounds.length - 1] : { roundId: NaN, roundName: ''} ;
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

  onMultiplierClicked(message: string): void {
    this.pageTitle = 'Team: ' + message;
  }

  compareUsers( user1:IUser, user2:IUser ){
    return user1 && user2 && user1.userId === user2.userId;
  }
}
