import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../shared/model';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<IUser | null>;
    public user: Observable<IUser | null>;

    apiUrl : string = 'api';

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string)  {
        return this.http.get<IUser>(`${this.apiUrl}/users/authenticate.json`) 
        //return this.http.post<IUser>(`${this.apiUrl}/users/authenticate.json`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
        
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: IUser) {
        return this.http.post(`${this.apiUrl}/users/register`, user);
    }

    getById(id: number) {
        return this.http.get<IUser>(`${this.apiUrl}/users/${id}`);
    }

}