import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';
import { MatchComponent } from './match.component';

@NgModule({
  declarations: [
    AdminComponent,
    MatchComponent
  ], 
  imports: [
    RouterModule.forChild([
        { path: 'admin', 
            //canActivate: [AuthGuard], 
            component: AdminComponent },
    ]),
    SharedModule 
  ],
})
export class AdminModule { }
