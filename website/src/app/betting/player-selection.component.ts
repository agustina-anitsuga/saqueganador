import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { IPlayerStatsPerRound, ILeague, ITeam, emptyLeague, emptyTeam } from "../shared/model";
import { BettingService } from "./betting.service";

@Component({
  selector: 'pm-player-selection', 
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.css']
})
export class PlayerSelectionComponent implements OnInit, OnDestroy {

  public pageTitle = 'Jugadores';

  @Input() 
  team : ITeam = emptyTeam();

  players : IPlayerStatsPerRound[] = [] ;
  filteredPlayers: IPlayerStatsPerRound[] = [] ;
  
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
    this._listFilter = value;
    this.filteredPlayers = this.filterPlayers();
  }

  get selectedLeague(): ILeague {
    return this._selectedLeague;
  }

  set selectedLeague( value: ILeague ){
      this._selectedLeague = value;
      this.filteredPlayers = this.filterPlayers();      
  } 

  filterPlayers() : IPlayerStatsPerRound[] {
      return this.players.filter(({ player }, index) => 
            ( !this._listFilter || player.playerName.toLowerCase().includes(this._listFilter.toLowerCase()) ) 
            && ( !this.selectedLeague || !this.selectedLeague.leagueId || player.league.leagueId === this.selectedLeague.leagueId ) 
          );;
  }

  ngOnInit(): void {
    this.sub = this.bettingService.getPlayers().subscribe({
      next: p => {
        this.players = p;
        this.filteredPlayers = this.players;
        this.leagues = this.getLeagues( p );
      },
      error: err => this.errorMessage = err
    });
  }

  getLeagues( players : IPlayerStatsPerRound[] ){
    let leagues = this.deDuplicate( players.map((p: IPlayerStatsPerRound) => p.player.league) );
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

  onPlayerClicked( player : IPlayerStatsPerRound ){
    this.playerClicked.emit( player );
  }


  @Output() 
  playerClicked: EventEmitter<IPlayerStatsPerRound> = new EventEmitter<IPlayerStatsPerRound>();

}
