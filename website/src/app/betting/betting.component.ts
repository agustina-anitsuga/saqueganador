import { Component, OnInit, OnDestroy } from "@angular/core";
import { ISelectedPlayer, IPlayerStatsPerRound, ITeam, emptySelectedPlayer, emptyTeam, IMatch } from "../shared/model";
import { AdminService } from "../admin/admin.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'pm-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.css']
})
export class BettingComponent implements OnInit, OnDestroy {

  public pageTitle = 'Apuestas';

  playerToAdd : ISelectedPlayer = emptySelectedPlayer();

  filteredTeam: ITeam = emptyTeam();

  sub!: Subscription;

  errorMessage = '';

  matches: IMatch[] = [];


  constructor(private adminService: AdminService) {}

  onPlayerSelected( message : IPlayerStatsPerRound ){
      this.playerToAdd = {
        position : 0,
        playerStats : message,
        playerMultiplier: 1,
        playerScore: 0,
        played: false
      }
  }

  onTeamSelected( message : ITeam ){
      this.filteredTeam = message;
  }

  ngOnInit(): void {
      this.loadMatches();
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe( );
  }

  loadMatches(){
    console.log("loadMatches");
    this.sub = this.adminService.getMatches().subscribe({
        next: matches => {
          this.matches = matches.Items;
        },
        error: err => this.errorMessage = err
      }
    );
  }

}
