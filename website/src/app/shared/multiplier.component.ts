import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { ISelectedPlayer, emptySelectedPlayer } from "../shared/model";

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
  player : ISelectedPlayer = emptySelectedPlayer();

  cropWidth = 75;
  
  @Output() 
  multiplierClicked: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

  ngOnChanges(): void {
    this.cropWidth = this.multiplier * 75 / 5;
  }

  onClick(): void {
    if( this.mode ==='EDIT' ){
      this.multiplierClicked.emit(this.player);
    }
  }
}
