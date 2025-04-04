import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";

import { IUser } from "../shared/model";
import { ITeam } from "../shared/model";
import { ITournament } from "../shared/model";
import { IMatch } from "../shared/model";
import { IRace } from "../shared/model";
import { IPlayerStatsPerRound } from "../shared/model";

import { environment } from '../../environments/environment';



export interface IMatchResponse {
  Items: IMatch[];
}

export interface IUserResponse {
  $metadata: object;
  Count: number;
  Items: IUser[];
}

export interface ITeamResponse {
  $metadata: object;
  Count: number;
  Items: ITeam[];
}

export interface ITournamentResponse {
  $metadata: object;
  Count: number;
  Items: ITournament[];
}


@Injectable({
  providedIn: 'root'
})
export class BettingService {

    private teamUrl = environment.teamUrl;
    private playersUrl = environment.playersUrl; 
    private usersUrl = environment.usersUrl;
    private tournamentUrl = environment.tournamentUrl;
    private matchesUrl = environment.matchesUrl;
    private raceUrl = environment.raceUrl;

    constructor( private http : HttpClient ) {}

    getMatches( tournamentId: number, roundId : number ) : Observable<IMatchResponse> {
        return this.http.get<IMatchResponse>(this.matchesUrl).pipe(
          //tap( data => console.log('All:', JSON.stringify(data)) ),
          // TODO filter properly
          catchError( this.handleError ) 
        );
    }

    getCurrentTournament() : Observable<ITournamentResponse> {
        return this.http.get<ITournamentResponse>(this.tournamentUrl).pipe(
            //tap( data => console.log('All:', JSON.stringify(data)) ),
            catchError( this.handleError ) 
        );
    }

    getTeams(): Observable<ITeamResponse> {
        return this.http.get<ITeamResponse>(this.teamUrl).pipe(
            //tap( data => console.log('All:', JSON.stringify(data)) ),
            catchError( this.handleError ) 
        );
    }

    getTeamsByUser( user : IUser ): Observable<ITeam[]> {
      let url = this.teamUrl + (user?user.userId:'') ;
      return this.http.get<ITeam[]>(url).pipe(
          //tap( data => console.log('All:', JSON.stringify(data)) ),
          catchError( this.handleError ) 
      );
    }

    getRace( ): Observable<IRace[]> {
      let url = this.raceUrl ;
      return this.http.get<IRace[]>(url).pipe(
          catchError( this.handleError ) 
      );
    }

    getPlayers( tournamentId : number, roundId : number ): Observable<IPlayerStatsPerRound[]> { 
      let url = this.playersUrl + (roundId?roundId:1) ; //+"-"+(roundId?roundId:1)+".json"
      //console.log(url);
      return this.http.get<IPlayerStatsPerRound[]>(url).pipe(
          //tap( data => console.log('All:', JSON.stringify(data)) ),
          catchError( this.handleError ) 
      );
    }

    getGroupUsers(): Observable<IUserResponse> {
      let ret = this.http.get<IUserResponse>(this.usersUrl).pipe(
          //tap( data => console.log('All:', JSON.stringify(data)) ),
          catchError( this.handleError ) 
      );
      return ret;
    }

    saveTeam( team : ITeam ) { //: Observable<ITeam> {
      let saveTeamUrl = this.teamUrl + team.teamId;
      //console.log(saveTeamUrl)
      let ret = this.http.post<ITeam>(saveTeamUrl, team)
      .pipe(
        //tap( data => console.log('All:', JSON.stringify(data)) ),
        catchError( this.handleError )).subscribe(response => console.log('subscribe'));
      //console.log('savedTeam');
      return ret;
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
