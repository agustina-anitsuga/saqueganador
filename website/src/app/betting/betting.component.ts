import { Component } from "@angular/core";
import { ISelectedPlayer, IPlayerStatsPerRound, ITeam, emptySelectedPlayer, emptyTeam } from "../shared/model";

@Component({
  selector: 'pm-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.css']
})
export class BettingComponent {

  public pageTitle = 'Apuestas';

  playerToAdd : ISelectedPlayer = emptySelectedPlayer();

  filteredTeam: ITeam = emptyTeam();

  
  onPlayerSelected( message : IPlayerStatsPerRound ){
      this.playerToAdd = {
        position : NaN,
        playerStats : message,
        playerMultiplier: 1,
        playerScore: 0,
        played: false
      };
  }

  onTeamSelected( message : ITeam ){
      this.filteredTeam = message;
  }

  onMultiplierAdded( message: ISelectedPlayer ){
      console.log('Multiplier added'+JSON.stringify(message));
  }

}
