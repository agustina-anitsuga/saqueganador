import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AuthComponent } from './auth.component';
import { UseAuthenticatorComponent } from './authenticator.component';


@NgModule({
  declarations: [
    AuthComponent,
    UseAuthenticatorComponent
  ],
  imports: [
    CommonModule,
    AmplifyAuthenticatorModule,
    RouterModule.forChild([
      { path: 'login', component: AuthComponent }
  ]),
  ]
})
export class AuthModule { }
