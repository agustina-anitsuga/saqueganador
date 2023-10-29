import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { ITournament } from "./shared/model";
import { BettingService } from "./betting/betting.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'Saqueganador';
  sub!: Subscription;
  errorMessage : string = '';

  tournament : ITournament = { tournamentId : NaN, tournamentName: '', currentRound : { roundId: NaN, roundName: ''}};
  
  constructor(private modalService: NgbModal, private bettingService: BettingService) {}
 
  public open(modal: any): void {
    this.modalService.open(modal);
  }

  ngOnInit(): void {
    console.log('In OnInit');

    this.sub = this.bettingService.getCurrentTournament().subscribe({
      next: t => {
        this.tournament = t;
      },
      error: err => this.errorMessage = err
    });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
