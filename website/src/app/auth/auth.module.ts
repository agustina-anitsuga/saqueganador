import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AuthComponent } from './auth.component';
import { UseAuthenticatorComponent } from './authenticator.component';
import { AccountComponent } from './account.component';
import { AuthGuard } from './auth.guard';


@NgModule({
  declarations: [
    AuthComponent,
    UseAuthenticatorComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    AmplifyAuthenticatorModule,
    RouterModule.forChild([
      { path: 'login', component: AuthComponent },
      { path: 'account', canActivate: [AuthGuard], component: AccountComponent }
  ]),
  ]
})
export class AuthModule { }
