import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AdminService } from "./admin.service";
import { AuthenticatorService } from '@aws-amplify/ui-angular'
import { IRound, ILeague, emptyLeague, emptyRound, ITournament, IMatch, IMatchPlayer, emptyTournament } from "../shared/model";
import { deDuplicateRounds } from "../shared/utils";
import { AlertService } from "../shared/alert.service";

@Component({
  selector: 'pm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public pageTitle = 'Administrar Partidos';

  tournament : ITournament = emptyTournament();
  matches : IMatch[] = [];
  filteredMatches : IMatch[] = [];
  rounds : IRound[] = [];
  leagues : ILeague[] = [];

  private _selectedRound : IRound = emptyRound();
  private _selectedLeague : ILeague = emptyLeague();
  private _listFilter = '';
  private _noTime =  false;
  private _noResult = false;

  errorMessage = '';

  sub!: Subscription;
  subTournament!: Subscription;

  
  constructor( private adminService: AdminService, 
               private alertService: AlertService,  
               private authenticator: AuthenticatorService) {}


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

  get noTime(): boolean {
    return this._noTime;
  }

  set noTime( value:boolean ){
      this._noTime = value;
      this.filteredMatches = this.performFilter();
  }

  get noResult(): boolean {
    return this._noResult;
  }

  set noResult( value:boolean ){
      this._noResult = value;
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

    this.subTournament = this.adminService.getCurrentTournament().subscribe({
      next: t => {
        this.tournament = t.Items[0]; 
      },
      error: err => this.errorMessage = err
    });

  }

  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
    if(this.subTournament) this.subTournament.unsubscribe();
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
    let ret = this.getMatchesWithNoTime(
                this.getMatchesWithNoResult(
                  this.getMatchesByPlayer(
                    this.getMatchesByLeague(
                      this.getMatchesByRound(this.matches,
                  this.selectedRound),this.selectedLeague),this.listFilter), this.noResult), this.noTime);
    return ret;
  }

  getMatchesWithNoTime( matches : IMatch[], noTime: boolean) : IMatch[] {
    const ret = noTime? matches.filter((t: IMatch) => !t.matchStartTime ) : matches;
    return ret;
  }

  getMatchesWithNoResult( matches : IMatch[], noResult: boolean) : IMatch[] {
    const ret = noResult? matches.filter((t: IMatch) => !(t.a.won || t.b.won) ) : matches;
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
            this.matchesLeague( league, t.a ) || this.matchesLeague( league, t.b ) 
          )) ;
    } 
    return ret;
  }

  matchesLeague( league:ILeague, matchPlayer : IMatchPlayer ) : boolean {
      return matchPlayer.player 
          && matchPlayer.player.league 
          && (!(Number.isNaN(league.leagueId))) ? 
              matchPlayer.player.league.leagueId === league.leagueId : false ;
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

  currentRound(){
    let roundId = this.tournament.currentRound;
    let round = this.tournament.rounds.find( (r) => r.roundId === roundId );
    return '' + roundId + ' - ' + (round?round.roundName:'');
  }

  onNextRoundTeamsCreated(){
    this.alertService.clear();
    this.adminService.createNextRoundTeams().subscribe(
    post => {
      this.alertService.info("Ronda iniciada");
    },
    err => {
      console.log(err);
      this.alertService.error("Error -> "+err);
    });
  }

  onGameMovedToNextRound(){
    this.alertService.clear();
    this.adminService.moveGameToNextRound().subscribe(
    post => {
      this.alertService.info("Juego avanzado a la ronda siguiente");
    },
    err => {
      console.log(err);
      this.alertService.error("Error -> "+err);
    });
  }

}
