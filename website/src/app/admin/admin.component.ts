import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IMatch, IMatchPlayer } from "../shared/model";
import { AdminService } from "./admin.service";
import { AuthenticatorService } from '@aws-amplify/ui-angular'
import { IRound, ILeague, emptyLeague, emptyRound } from "../shared/model";
import { deDuplicateRounds } from "../shared/utils";

@Component({
  selector: 'pm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public pageTitle = 'Admin';

  matches : IMatch[] = [];
  filteredMatches : IMatch[] = [];
  rounds : IRound[] = [];
  leagues : ILeague[] = [];

  private _selectedRound : IRound = emptyRound();
  private _selectedLeague : ILeague = emptyLeague();
  private _listFilter = '';

  errorMessage = '';

  sub!: Subscription;
  
  constructor( private adminService: AdminService, private authenticator: AuthenticatorService) {}


  set selectedRound( round: IRound ) {
    this._selectedRound = round;
    this.filteredMatches = this.performFilter();
  }

  get selectedRound() : IRound {
    return this._selectedRound;
  }

  set selectedLeague( league: ILeague ) {
    this._selectedLeague = league;
    this.filteredMatches = this.performFilter();
  }

  get selectedLeague() : ILeague {
    return this._selectedLeague;
  }

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredMatches = this.performFilter();
  }

  ngOnInit(): void {
    
    this.sub = this.adminService.getMatches().subscribe({
      next: adr => {
        this.matches = adr.Items; 
        this.rounds = this.getRounds(this.matches);
        this.leagues = this.getLeagues(this.matches);
        this.initializeSelections();
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initializeSelections(){
    this.selectedRound = this.getCurrentRound();
  }

  getRounds( matches : IMatch[] ) : IRound[] {
    let unsortedRounds = matches.map((t: IMatch) => t.round) 
    return deDuplicateRounds( unsortedRounds);
  }

  getLeagues( matches : IMatch[] ) : ILeague[] {
    return [ { leagueId:1, leagueName: 'ATP' } , { leagueId:2, leagueName: 'WTA' } ];
  }

  getCurrentRound() : IRound {
    return this.rounds? this.rounds[this.rounds.length - 1] : emptyRound() ;
  }

  performFilter() : IMatch[] {
    let ret = this.getMatchesByPlayer(
                this.getMatchesByLeague(
                  this.getMatchesByRound(this.matches,this.selectedRound),this.selectedLeague),this.listFilter);
    return ret;
  }

  getMatchesByRound( matches : IMatch[], round : IRound ) : IMatch[] {
    const ret = round? matches.filter((t: IMatch) => t.round.roundId === round.roundId ) : [];
    return ret;
  }

  getMatchesByLeague( matches : IMatch[], league : ILeague ) : IMatch[] {
    let ret = matches;
    if( league && !(Number.isNaN(league.leagueId)) ) {
        ret = ( matches.filter((t: IMatch) => 
          t.a.player && t.a.player.league && (!(Number.isNaN(league.leagueId))) ? 
              t.a.player.league.leagueId === league.leagueId : false ) ) ;
    }
    return ret;
  }

  getMatchesByPlayer( matches : IMatch[], playerName : string ) : IMatch[] {
    let ret = matches;
    if( playerName ) {
        ret = ( matches.filter((t: IMatch) => 
               ( this.nameIsSet(t.a) && t.a.player.playerName.toLowerCase().includes(playerName.toLowerCase())) ||
               ( this.nameIsSet(t.b) && t.b.player.playerName.toLowerCase().includes(playerName.toLowerCase()))
               ) 
          ) ;
    }
    return ret;
  }

  nameIsSet( value : IMatchPlayer ): boolean {
    return !!value && !!value.player && !!value.player.playerName && typeof value.player.playerName === 'string' ;
  } 

}
