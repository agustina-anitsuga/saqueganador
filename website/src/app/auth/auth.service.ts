import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular'

import { Amplify } from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(
        private router: Router,
        private authenticator: AuthenticatorService
    ) {   
    }

    userIsAuthenticated() {
        return this.authenticator.authStatus === 'authenticated';
    }

    currentUser() {
        return this.authenticator.user || this.currentUserFromLocalStorage() ;
    }

    private currentUserFromLocalStorage(){
        //let user : string | null = localStorage.getItem('user');
        //console.log("currentUserFromLocalStorage: " + user);
        //return user === undefined || user === null ? null : JSON.parse(user);
        return null;
    }

    login(user : any, returnUrl: string)  {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigateByUrl(returnUrl);
    }

    logout() {
        this.authenticator.signOut();
        this.router.navigate(['/login']);
    }

}