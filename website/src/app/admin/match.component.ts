import { Component, Input } from "@angular/core";
import { IMatch, IMatchPlayer, emptyMatch, emptyMatchPlayer } from "../shared/model";
import { AdminService } from "./admin.service";


@Component({
  selector: 'pm-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent {

  public pageTitle = 'Match';

  @Input() 
  match : IMatch = emptyMatch();

  winner : IMatchPlayer = emptyMatchPlayer();
  

  constructor( private adminService: AdminService ) {}

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

  onItemSaved(){
    if(!this.match.a.won){ this.match.a.won = false }
    if(!this.match.b.won){ this.match.b.won = false }  
    this.saveMatchResult();
  }

  saveMatchResult(){
      this.adminService.saveMatch(this.match);
  }
}
