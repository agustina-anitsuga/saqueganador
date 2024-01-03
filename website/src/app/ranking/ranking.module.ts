import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RankingComponent } from './ranking.component';

@NgModule({
  declarations: [
    RankingComponent,
  ],
  imports: [
    RouterModule.forChild([
        { path: 'ranking', component: RankingComponent },
    ]),
    SharedModule
  ]
})
export class RankingModule { }
