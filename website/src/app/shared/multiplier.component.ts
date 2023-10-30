import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { ISelectedPlayer } from "../shared/model";

@Component({
  selector: 'pm-multiplier',
  templateUrl: './multiplier.component.html',
  styleUrls: ['./multiplier.component.css']
})
export class MultiplierComponent implements OnChanges {

  @Input() 
  mode : string = 'VIEW' ; // VIEW, EDIT  

  @Input() 
  multiplier : number = 0;
  
  @Input() 
  player : ISelectedPlayer = { 
        position : NaN,
        playerStats : {
          player : {
            playerId: NaN, 
            playerName:'', 
            playerProfilePic:'', 
            playerProfileUrl:'', 
            league: { leagueId: NaN, leagueName: ''} 
          },
          pointsToAward: NaN ,
        },
        playerMultiplier: NaN,
        playerScore: 0,
        played: false
        };

  cropWidth = 75;
  
  @Output() 
  multiplierClicked: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(): void {
    this.cropWidth = this.multiplier * 75 / 5;
  }

  onClick(): void {
    if( this.mode ==='EDIT' ){
      console.log(`The multiplier ${this.multiplier} was clicked!`);
      this.multiplierClicked.emit(`Add a multiplier to `+
                (this.player&&this.player.playerStats && this.player.playerStats.player?this.player.playerStats.player.playerName:'Unknown player')+
                ' who already has '+this.multiplier+' yellow balls');
    }
  }
}
