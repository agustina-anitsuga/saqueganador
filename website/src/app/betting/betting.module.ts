import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BettingComponent } from './betting.component';
import { TeamComponent } from './team.component';
import { PlayersComponent } from './players.component';

@NgModule({
  declarations: [
    BettingComponent,
    TeamComponent,
    PlayersComponent
  ],
  imports: [
    RouterModule.forChild([
        { path: 'teams', component: TeamComponent },
        { path: 'bet', component: BettingComponent },
    ]),
    SharedModule,    
  ]
})
export class BettingModule { }
