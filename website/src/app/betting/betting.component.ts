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
      console.log('BettingComponent.onPlayerSelected '+message.player.playerName);
      this.playerToAdd = {
        position : 0,
        playerStats : message,
        playerMultiplier: 1,
        playerScore: 0,
        played: false
      }
  }

  onTeamSelected( message : ITeam ){
      console.log('BettingComponent.onTeamSelected');
      this.filteredTeam = message;
  }

}
