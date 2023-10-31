import { Component } from "@angular/core";
import { ISelectedPlayer, IPlayerStatsPerRound } from "../shared/model";

@Component({
  selector: 'pm-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.css']
})
export class BettingComponent {

  public pageTitle = 'Apuestas';

  
  onPlayerSelected( message : IPlayerStatsPerRound ){
      console.log('Player selected '+JSON.stringify(message));
      alert('Player selected '+JSON.stringify(message));
  }

  onMultiplierAdded( message: ISelectedPlayer ){
      console.log('Multiplier added'+JSON.stringify(message));
  }

}
