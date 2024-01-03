import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AuthService } from './auth.service';
import { Hub } from 'aws-amplify';

@Component({ 
  selector: 'pm-auth', 
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {

    listener : any = (data : any) => {
        switch (data.payload.event) {
            case 'signIn':
                console.log('user signed in');
                this.doPostLogin();
                break;
            case 'signUp':
                console.log('user signed up');
                break;
            case 'signOut':
                console.log('user signed out');
                break;
            case 'signIn_failure':
                console.log('user sign in failed');
                break;
            case 'configured':
                console.log('the Auth module is configured');
                break;
            default:
                console.log('Something went wrong, look at data object', data);
        }
        }

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private authenticator: AuthenticatorService
    ) { }

    ngOnInit(): void {
        Hub.listen('auth', this.listener);
    }
    
    doPostLogin() : void {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.authService.login(this.authenticator.user,returnUrl);
    }
}
