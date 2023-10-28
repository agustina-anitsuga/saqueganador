import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ITeam } from "../shared/model";
import { IRound } from "../shared/model";
import { BettingService } from "./betting.service";

@Component({
  selector: 'pm-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.css']
})
export class BettingComponent implements OnInit, OnDestroy {

  public pageTitle = 'Team';

  team : ITeam[] = [] ;
  filteredTeam: ITeam = { 
          user: { userId: NaN, userName: ''},
          tournament: { tournamentId: NaN, tournamentName: ''}, 
          round: { roundId: NaN, roundName: ''}, 
          selection: [],
          score: NaN } ;
  rounds : IRound[] = [];
  private _selectedRound : IRound = { roundId : NaN, roundName : '' };
  errorMessage = '';
  sub!: Subscription;

  constructor(private bettingService: BettingService) {}
  
  set selectedRound( round: IRound ) {
    this.filteredTeam = this.performFilter(+round.roundId);
  }

  performFilter(roundId: number): ITeam {
    const ret = this.getTeamByRound(this.team,roundId);
    return ret;
  }

  ngOnInit(): void {
    console.log('In OnInit');
    this.sub = this.bettingService.getTeam().subscribe({
      next: t => {
        this.team = t;
        this.rounds = this.getRounds(t);
        this._selectedRound = this.getCurrentRound();
        this.selectedRound = this._selectedRound;
      },
      error: err => this.errorMessage = err
    });
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
    this.sub.unsubscribe();
  }

  onMultiplierClicked(message: string): void {
    this.pageTitle = 'Team: ' + message;
  }
}
