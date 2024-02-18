import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ISelectedPlayer, emptySelectedPlayer, IMatch } from "../shared/model";
import { matchHasStarted } from "../shared/utils" ;

@Component({
  selector: 'pm-multiplier',
  templateUrl: './multiplier.component.html',
  styleUrls: ['./multiplier.component.css']
})
export class MultiplierComponent { 

  @Input() 
  mode : string = 'VIEW' ; // VIEW, EDIT  

  @Input() 
  multiplier : number = 0;

  @Input()
  maximumMultipliers : number = 3;
  
  @Input()
  matches : IMatch[] = [];

  @Input() 
  player : ISelectedPlayer = emptySelectedPlayer();

  @Output() 
  multiplierAdded: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

  @Output() 
  multiplierRemoved: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();


  possibleMutipliers() : number {
    return this.maximumMultipliers - this.multiplier;
  }

  matchHasStarted() {
    if(this.player && this.player.playerStats){
      let matchId = this.player.playerStats.matchId;
      return matchHasStarted(matchId,this.matches);
    }
    return false;
  }

  addMutiplier(): void {
    if( this.mode ==='EDIT' && !this.matchHasStarted() ){
      this.multiplierAdded.emit(this.player);
    }
  }

  removeMutiplier(): void {
    if( this.mode ==='EDIT' && !this.matchHasStarted() ){
      this.multiplierRemoved.emit(this.player);
    }
  }

}
