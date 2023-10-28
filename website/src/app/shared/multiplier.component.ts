import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";

@Component({
  selector: 'pm-multiplier',
  templateUrl: './multiplier.component.html',
  styleUrls: ['./multiplier.component.css']
})
export class MultiplierComponent implements OnChanges {

  @Input() 
  multiplier = 0;
  
  cropWidth = 75;
  
  @Output() 
  multiplierClicked: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(): void {
    this.cropWidth = this.multiplier * 75 / 5;
  }

  onClick(): void {
    console.log(`The multiplier ${this.multiplier} was clicked!`);
    this.multiplierClicked.emit(`The multiplier ${this.multiplier} was clicked!`);
  }
}
