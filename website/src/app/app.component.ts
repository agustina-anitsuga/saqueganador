import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ITournament, emptyTournament } from "./shared/model";
import { BettingService } from "./betting/betting.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from "./account/account.service";


@Component({ 
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'Saqueganador';
  sub!: Subscription;
  errorMessage : string = ''; 

  tournament : ITournament = emptyTournament();
  
  constructor(private modalService: NgbModal, private bettingService: BettingService, private accountService: AccountService) {}
 
  public open(modal: any): void {
    this.modalService.open(modal);
  }

  ngOnInit(): void {
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

  isUserLoggedIn(){
    return this.accountService.userValue;
  }

  logout() {
    this.accountService.logout();
  }
}
