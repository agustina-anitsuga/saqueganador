import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap, throwError, map } from "rxjs";

import { ITeam } from "../shared/model";

@Injectable({
  providedIn: 'root'
})
export class BettingService {

    private teamUrl = 'api/betting/myteam.json';
    
    constructor( private http : HttpClient ) {}

    getTeam(): Observable<ITeam[]> {
        return this.http.get<ITeam[]>(this.teamUrl).pipe(
            tap( data => console.log('All:', JSON.stringify(data)) ),
            catchError( this.handleError ) 
        );
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(() => errorMessage);
    }

}
