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

  public pageTitle = 'Jugadores';

  errorMessage = '';
  sub!: Subscription;

  constructor(private bettingService: BettingService) {}
  

  ngOnInit(): void {
    console.log('In OnInit');
    
  }


  ngOnDestroy(): void {
    //this.sub.unsubscribe();
  }

}
