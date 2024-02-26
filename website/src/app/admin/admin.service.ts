import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { IMatch, ITeam, ITournament } from "../shared/model";

import { environment } from '../../environments/environment';


export interface IMatchResponse {
  Items: IMatch[];
}

export interface ITournamentResponse {
  $metadata: object;
  Count: number;
  Items: ITournament[];
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {

    private matchesUrl = environment.matchesUrl;
    private startRoundUrl = environment.roundUrl;
    private tournamentUrl = environment.tournamentUrl;

    constructor( private http : HttpClient ) {}

    getMatches() : Observable<IMatchResponse> {
        return this.http.get<IMatchResponse>(this.matchesUrl).pipe(
          //tap( data => console.log('All:', JSON.stringify(data)) ),
          catchError( this.handleError ) 
        );
    }

    saveMatch( match : IMatch ): Observable<IMatch> {
      let saveMatchUrl = this.matchesUrl + match.matchId;
      //console.log('saveMatch '+saveMatchUrl+' '+JSON.stringify(match));
      return this.http.post<IMatch>(saveMatchUrl, match).pipe(
        //tap( data => console.log('All:', JSON.stringify(data)) ),
        catchError( this.handleError )
          //).subscribe(response => console.log('subscribe')
        );
    }

    getCurrentTournament() : Observable<ITournamentResponse> {
      return this.http.get<ITournamentResponse>(this.tournamentUrl).pipe(
          //tap( data => console.log('All:', JSON.stringify(data)) ),
          catchError( this.handleError ) 
      );
    }

    startNextRound( ): Observable<ITeam[]> {
      return this.http.post<ITeam[]>(this.startRoundUrl,'').pipe(
        //tap( data => console.log('All:', JSON.stringify(data)) ),
        catchError( this.handleError )
          //).subscribe(response => console.log('subscribe')
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
