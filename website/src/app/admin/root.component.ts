import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AdminService } from "./admin.service";
import { AuthenticatorService } from '@aws-amplify/ui-angular'
import { IRound, ILeague, emptyLeague, emptyRound, ITournament, emptyTournament, ILuckyLoser, emptyLuckyLoser } from "../shared/model";
import { AlertService } from "../shared/alert.service";

@Component({
  selector: 'pm-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, OnDestroy {

  public pageTitle = 'Administrar Juego';

  tournament : ITournament = emptyTournament();
  
  luckyLoser : ILuckyLoser = emptyLuckyLoser();

  private _selectedRound : IRound = emptyRound();
  private _selectedLeague : ILeague = emptyLeague();
  
  errorMessage = '';

  sub!: Subscription;
  subTournament!: Subscription;

  
  constructor( private adminService: AdminService, 
               private alertService: AlertService,  
               private authenticator: AuthenticatorService) {}


  ngOnInit(): void {

    this.subTournament = this.adminService.getCurrentTournament().subscribe({
      next: t => {
        this.tournament = t.Items[0]; 
      },
      error: err => this.errorMessage = err
    });

  }

  ngOnDestroy(): void {
    if(this.subTournament) this.subTournament.unsubscribe();
  }

  currentRound(){
    let roundId = this.tournament.currentRound;
    let round = this.tournament.rounds.find( (r) => r.roundId === roundId );
    return '' + roundId + ' - ' + (round?round.roundName:'');
  }

  onNextRoundTeamsCreated(){
    this.alertService.clear();
    this.adminService.createNextRoundTeams().subscribe(
    post => {
      this.alertService.info("Ronda iniciada");
    },
    err => {
      console.log(err);
      this.alertService.error("Error -> "+err);
    });
  }

  onGameMovedToNextRound(){
    this.alertService.clear();
    this.adminService.moveGameToNextRound().subscribe(
    post => {
      this.alertService.info("Juego avanzado a la ronda siguiente");
    },
    err => {
      console.log(err);
      this.alertService.error("Error -> "+err);
    });
  }

  onLuckyLoserAdded(){
    this.alertService.clear();
    this.adminService.addLuckyLoser(this.luckyLoser).subscribe(
      post => {
        this.alertService.info("Lucky loser agregado");
      },
      err => {
        console.log(err);
        this.alertService.error("Error -> "+err);
      });
  }
}
