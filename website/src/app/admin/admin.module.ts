import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';
import { MatchComponent } from './match.component';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [
    AdminComponent,
    MatchComponent,
    RootComponent
  ], 
  imports: [
    RouterModule.forChild([
        { path: 'admin', 
            canActivate: [AuthGuard], 
            component: AdminComponent },
        { path: 'root', 
              canActivate: [AuthGuard], 
              component: RootComponent },            
    ]),
    SharedModule 
  ],
})
export class AdminModule { }
