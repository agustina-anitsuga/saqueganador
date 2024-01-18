import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from "@angular/core";
import { IMatchPlayer } from "../shared/model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pm-player-modal',  
  templateUrl: './player-modal.component.html', 
  styleUrls: ['./player-modal.component.css']
})
export class PlayerModalComponent implements OnChanges {

  @Input() 
  player : any = null ;
  
  @Input()
  playerName : string = '' ;

  @Input()
  playerProfilePic : string = '' ;

  @Input()
  message : string = '' ; 

  @Input()
  display : boolean = false;

  @ViewChild('content') content : any ;

  constructor(private modalService: NgbModal) {}

  ngOnChanges(): void {
        if( this.display ){
            this.open(this.content);
        }
  }

  open(content:any) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {
                    if( result === "Accept" ){
                        this.onModalAccepted.emit(this.player);
                    } else {
                        this.onModalCancelled.emit(this.player);  
                    }
              }, 
           (reason) => {
                    this.onModalCancelled.emit(this.player);  
              }
      );
  }

  @Output() 
  onModalAccepted: EventEmitter<IMatchPlayer> = new EventEmitter<IMatchPlayer>();

  @Output() 
  onModalCancelled: EventEmitter<IMatchPlayer> = new EventEmitter<IMatchPlayer>();
}
