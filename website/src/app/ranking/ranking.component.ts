import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IRanking } from "../shared/model";
import { IRound } from "../shared/model";
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
  private _selectedRound : IRound = { roundId : NaN, roundName : '' };
  errorMessage = '';
  sub!: Subscription;

  constructor(private rankingService: RankingService) {}
  
  set selectedRound( round: IRound ) {
    this.filteredRanking = this.performFilter(+round.roundId);
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
    console.log('In OnInit');
    this.sub = this.rankingService.getRanking().subscribe({
      next: r => {
        this.ranking = r;
        this.filteredRanking = this.getGlobalRanking(r);
        this.rounds = this.getRounds(r);
      },
      error: err => this.errorMessage = err
    });
  }

  getRankingByRound( ranking: IRanking[], roundId : number ) {
    return this.sortRanking(this.ranking.filter((r: IRanking) => r.round.roundId === roundId ));
  }

  getRounds( ranking : IRanking[] ) {
    return this.deDuplicate( ranking.map((r: IRanking) => r.round) );
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
    return ranking.sort(function(a, b){return a.position - b.position });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
