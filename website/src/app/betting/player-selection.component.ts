import { Component, OnDestroy, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { ISelectedPlayer, ILeague, ITeam, emptyLeague, emptyTeam, IMatch, ITournament, emptyTournament } from "../shared/model";
import { BettingService, IMatchResponse } from "./betting.service";

@Component({
  selector: 'pm-player-selection', 
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.css']
})
export class PlayerSelectionComponent implements OnInit, OnDestroy, OnChanges {

  public pageTitle = 'Jugadores';

  @Input() 
  team : ITeam = emptyTeam();

  @Input()
  matches : IMatch[] = [];

  tournament : ITournament = emptyTournament() ;

  filteredMatches: IMatch[] = [] ;
  
  leagues : ILeague[] = [];
  private _selectedLeague : ILeague = emptyLeague();
  private _listFilter = '';
  
  errorMessage = '';
  sub!: Subscription;

  constructor(private bettingService: BettingService) {}
  
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    console.log('listFilter');
    this._listFilter = value;
    this.filteredMatches = this.filterMatches();
  }

  get selectedLeague(): ILeague {
    return this._selectedLeague;
  }

  set selectedLeague( value: ILeague ){
      this._selectedLeague = value;
      this.filteredMatches = this.filterMatches();      
  } 

  filterMatches() : IMatch[] {
      console.log('filterMatches');
      return this.matches.filter(( match , index) => 
            ( !this._listFilter || (match.a.player && match.a.player.playerName && match.a.player.playerName.toLowerCase().includes(this._listFilter.toLowerCase())) || 
                ( match.b.player && match.b.player.playerName && match.b.player.playerName.toLowerCase().includes(this._listFilter.toLowerCase())) ) 
            && ( !this.selectedLeague || !this.selectedLeague.leagueId || match.a.player.league.leagueId === this.selectedLeague.leagueId ) 
          );;
  }

  ngOnInit(): void {
    this.loadPlayersInRound();
  }

  loadPlayersInRound(){
    //console.log("loadPlayersInRound:"+JSON.stringify(this.team));
    if( this.team ){
        this.tournament = this.team.tournament;
        let tournamentId = this.tournament.tournamentId;
        let roundId = this.team.round.roundId;
        this.sub = this.bettingService.getMatches(tournamentId,roundId).subscribe({
          next: p => {
            this.matches = this.filterCurrentRound(p,roundId);
            this.filteredMatches = this.matches;
            this.leagues = this.getLeagues( this.filteredMatches );
          },
          error: err => this.errorMessage = err
        });
    }
  }

  filterCurrentRound( matches : IMatchResponse, roundId : number ){
    return roundId? matches.Items.filter( (m, index) => m.round.roundId === roundId ) : [];
  }

  getLeagues( matches : IMatch[] ){
    console.log(JSON.stringify(matches));
    let leagues = this.deDuplicate( matches.map((p: IMatch) => (p.a.player.league ? p.a.player.league : p.b.player.league)) );
    leagues.push({ leagueId: NaN, leagueName: '' });
    return leagues;
  }

  deDuplicate( leagues : ILeague[] ){
    const ids = leagues.map(({ leagueId }) => leagueId );
    const filtered = leagues.filter(({ leagueId }, index) => !ids.includes(leagueId, index + 1));
    return filtered;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onPlayerClicked( player : ISelectedPlayer ){
    this.playerClicked.emit( player );
  }

  matchStartTimeIsKnown( match : IMatch ){
    return !!match.matchStartTime;
  }

  formattedMatchStartTime( match : IMatch ){
    return ('' + match.matchStartTime).replace('T',' ');
  }

  ngOnChanges(): void {
    this.loadPlayersInRound();
  }

  @Output() 
  playerClicked: EventEmitter<ISelectedPlayer> = new EventEmitter<ISelectedPlayer>();

}
