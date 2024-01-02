import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IRanking, IRound, emptyRound } from "../shared/model";
import { RankingService } from "./ranking.service";

@Component({
  selector: 'pm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit, OnDestroy {

  public pageTitle = 'Ranking';
  ranking : IRanking[] = [] ;
  filteredRanking: IRanking[] = [];
  rounds : IRound[] = [];
  private _selectedRound : IRound = emptyRound();
  errorMessage = ''; 
  sub!: Subscription;

  constructor(private rankingService: RankingService) {}
  
  set selectedRound( round: IRound ) {
    this._selectedRound = round;
    this.filteredRanking = this.performFilter(+round.roundId);
  }

  get selectedRound() : IRound {
    return this._selectedRound;
  }

  performFilter(filterBy: number): IRanking[] {
    if ( !filterBy ){
      return this.getGlobalRanking(this.ranking)
    } else {
      filterBy = filterBy.valueOf();
      return this.getRankingByRound(this.ranking,filterBy)
    }
  }

  ngOnInit(): void {
    this.sub = this.rankingService.getRanking().subscribe({
      next: r => {
        this.ranking = r.Items;
        this.filteredRanking = this.getGlobalRanking(this.ranking);
        this.rounds = this.getRounds(this.ranking);
      },
      error: err => this.errorMessage = err
    });
  }

  getRankingByRound( ranking: IRanking[], roundId : number ) {
    return this.sortRanking(this.ranking.filter((r: IRanking) => r.round.roundId === roundId ));
  }

  getRounds( ranking : IRanking[] ) {
    return this.sortRounds( this.deDuplicate( ranking.map((r: IRanking) => r.round) ) );
  }

  deDuplicate( rounds : IRound[] ){
    const ids = rounds.map(({ roundId }) => roundId );
    const filtered = rounds.filter(({ roundId }, index) => !ids.includes(roundId, index + 1));
    return filtered;
  }

  getGlobalRanking( ranking : IRanking[] ) {
    return this.sortRanking(ranking.filter((r: IRanking) => !r.round || !r.round.roundId));
  }

  sortRanking( ranking : IRanking[] ){
    return ranking.sort(function(a, b){
        let adiff = a.position - b.position;
        return (adiff === 0) ? 
          (
            ( a.user.userName.toLowerCase() < b.user.userName.toLowerCase() ? -0.1 : 
            ( a.user.userName.toLowerCase() > b.user.userName.toLowerCase() ? 0.1 : 0 )) 
          ): adiff;
    });
  }

  sortRounds( rounds : IRound[] ){
    return rounds.sort(function(a, b){return a.sortOrder - b.sortOrder });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
