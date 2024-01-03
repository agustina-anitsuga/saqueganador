import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ISelectedPlayer, emptySelectedPlayer } from "../shared/model";

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
  player : ISelectedPlayer = emptySelectedPlayer();

  @Output() 
  multiplierAdded: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

  @Output() 
  multiplierRemoved: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();


  possibleMutipliers() : number {
    return this.maximumMultipliers - this.multiplier;
  }

  addMutiplier(): void {
    if( this.mode ==='EDIT' ){
      this.multiplierAdded.emit(this.player);
    }
  }

  removeMutiplier(): void {
    if( this.mode ==='EDIT' ){
      this.multiplierRemoved.emit(this.player);
    }
  }

}
