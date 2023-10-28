import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BettingComponent } from './betting.component';

@NgModule({
  declarations: [
    BettingComponent,
  ],
  imports: [
    RouterModule.forChild([
        { path: 'myteam', component: BettingComponent },
    ]),
    SharedModule,    
  ]
})
export class BettingModule { }
