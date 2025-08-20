import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { IRace } from "../shared/model";
import { BettingService } from "../betting/betting.service";

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  public pageTitle = 'Bienvenidos';


    sub!: Subscription;
  
    errorMessage : string = ''; 
    
    race : IRace[] = [];

    showMore : boolean = false;
    
      
    constructor(private bettingService: BettingService) {}
     
  
    ngOnInit(): void {
      this.sub = this.bettingService.getRace().subscribe({
        next: t => {
          this.race = this.sortRace(t);
        },
        error: err => this.errorMessage = err
      });
  
    }
  
    sortRace( ranking: IRace[] ) {
      return ranking.sort(function(a, b){
        let adiff = a.position - b.position;
        return (adiff === 0) ? 
          (
            ( a.user.userName.toLowerCase() < b.user.userName.toLowerCase() ? -0.1 : 
            ( a.user.userName.toLowerCase() > b.user.userName.toLowerCase() ? 0.1 : 0 )) 
          ): adiff;
      });
    }

    ngOnDestroy(): void {
      this.sub.unsubscribe();
    }
  
}
