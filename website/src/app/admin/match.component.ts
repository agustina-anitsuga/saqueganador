import { Component, Input, OnInit } from "@angular/core";
import { IMatch, IMatchPlayer, emptyMatch, emptyMatchPlayer } from "../shared/model";
import { AdminService } from "./admin.service";
import { AlertService } from "../shared/alert.service";


@Component({
  selector: 'pm-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  public pageTitle = 'Match';

  @Input() 
  match : IMatch = emptyMatch();

  winner : IMatchPlayer = emptyMatchPlayer();
  

  constructor( private adminService: AdminService, private alertService: AlertService ) {}

  onItemSelection( item:IMatchPlayer ){
      if( item === this.match.a ){
          if( item.won ){
            item.won = false;
          } else {
            item.won = true;
            this.match.b.won = false;
          }
      } else {
          if( item.won ){
            item.won = false;
          } else {  
            item.won = true;
            this.match.a.won = false;
          }
      }
  }

  ngOnInit(){
    //this.alertService.clear();
  }

  onItemSaved(){
    if(!this.match.a.won){ this.match.a.won = false }
    if(!this.match.b.won){ this.match.b.won = false }  
    this.saveMatchResult();
  }

  saveMatchResult(){
    this.alertService.clear();
    this.adminService.saveMatch(this.match).subscribe(post => {
      this.alertService.info("Cambios guardados");
    },
    err => {
      console.log(err);
      this.alertService.error("Error -> "+err);
    });
  }
}
