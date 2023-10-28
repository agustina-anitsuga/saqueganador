import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { ISelectedPlayer, ITeam, IUser } from "../shared/model";
import { IRound } from "../shared/model";
import { BettingService } from "./betting.service";

@Component({
  selector: 'pm-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy {

  public pageTitle :string = 'Team';

  @Input() mode : string = 'OTHER' ; // 'EDIT'; // OWN, OTHER, EDIT  

  team : ITeam[] = [] ;
  filteredTeam: ITeam = { 
          user: { userId: NaN, userName: ''},
          tournament: { tournamentId: NaN, tournamentName: ''}, 
          round: { roundId: NaN, roundName: ''}, 
          selection: [],
          score: NaN } ;

  rounds : IRound[] = [];
  private _selectedRound : IRound = { roundId : NaN, roundName : '' };

  users : IUser[] = [];
  private _selectedUser : IUser = { userId: NaN, userName: ''};
  
  errorMessage = '';

  subTeam!: Subscription;
  subUsers!: Subscription;

  constructor(private bettingService: BettingService) {}
  
  set selectedUser( user: IUser ) {
    this._selectedUser = user;
    console.log('redirect to page for team '+user.userName);
  }

  set selectedRound( round: IRound ) {
    this.filteredTeam = this.performFilter(+round.roundId);
  }

  performFilter(roundId: number): ITeam {
    const ret = this.getTeamByRound(this.team,roundId);
    return ret;
  }

  ngOnInit(): void {
    console.log('In OnInit');
    this.subTeam = this.bettingService.getTeams().subscribe({
      next: t => {
        this.team = t;
        this.rounds = this.getRounds(t);
        this._selectedRound = this.getCurrentRound();
        this.selectedRound = this._selectedRound;
      },
      error: err => this.errorMessage = err
    });
    this.subUsers = this.bettingService.getGroupUsers().subscribe({
      next: u => {
        this.users = u;
      },
      error: err => this.errorMessage = err
    });
  }

  shouldDisplayPlayer( selectedPlayer : ISelectedPlayer ) {
    return  selectedPlayer.playerStats.player.playerId && (
            this.mode == 'OWN' ||
            this.mode === 'EDIT' ||
            (this.mode === 'OTHER' && selectedPlayer.played));
  }

  shouldDisplayPendingSelection( selectedPlayer : ISelectedPlayer ) {
    return  !selectedPlayer.playerStats.player.playerId && (
            this.mode == 'OWN' ||
            this.mode === 'EDIT' );
  }

  shouldDisplayPendingResult( selectedPlayer : ISelectedPlayer ) {
    return  this.mode == 'OTHER' && !selectedPlayer.played;
  }

  shouldAllowTeamSelection(){
    return this.mode === 'OTHER' 
  }

  getCurrentRound(){
      return this.rounds[this.rounds.length - 1];
  }

  getTeamByRound( ranking: ITeam[], roundId : number ) {
    const ret = this.team.filter((t: ITeam) => t.round.roundId === roundId )[0];
    return ret;
  }

  getRounds( team : ITeam[] ) {
    return this.deDuplicate( team.map((t: ITeam) => t.round) );
  }

  deDuplicate( rounds : IRound[] ){
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
}
