import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ITournament, emptyTournament } from "../shared/model";
import { BettingService } from "../betting/betting.service";


@Component({
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {
  public pageTitle = 'Cómo jugar';

  sub!: Subscription;

  errorMessage : string = ''; 
  
  tournament : ITournament = emptyTournament();
    
  constructor(private bettingService: BettingService) {}
   

  ngOnInit(): void {
    this.sub = this.bettingService.getCurrentTournament().subscribe({
      next: t => {
        this.tournament = t.Items[0];
      },
      error: err => this.errorMessage = err
    });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
