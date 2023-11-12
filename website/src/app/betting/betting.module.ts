import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BettingComponent } from './betting.component';
import { TeamComponent } from './team.component';
import { TeamGuard } from './team.guard';
import { PlayerSelectionComponent } from './player-selection.component';
import { AvailablePlayerComponent } from './available-player.component';
import { SelectedPlayerComponent } from './selected-player.component';
import { PlayerModalComponent } from './player-modal.component';
import { AuthGuard } from '../auth/auth.guard';
import { MultiplierComponent } from './multiplier.component';

@NgModule({
  declarations: [
    BettingComponent,
    TeamComponent,
    PlayerSelectionComponent,
    AvailablePlayerComponent,
    SelectedPlayerComponent,
    PlayerModalComponent,
    MultiplierComponent 
  ], 
  imports: [
    RouterModule.forChild([
        { path: 'teams', component: TeamComponent },
        { path: 'teams/:id', 
            canActivate: [TeamGuard],
            component: TeamComponent },
        { path: 'bet', 
            canActivate: [AuthGuard],
            component: BettingComponent },
    ]),
    SharedModule 
  ],
})
export class BettingModule { }
