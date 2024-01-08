import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IMatch, IMatchPlayer } from "../shared/model";
import { AdminService } from "./admin.service";
import { AuthenticatorService } from '@aws-amplify/ui-angular'
import { ISelectedPlayer, ITeam, IUser, IRound, emptyTeam, emptyRound, emptyUser, emptySelectedPlayer } from "../shared/model";


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

  private _selectedRound : IRound = emptyRound();

  errorMessage = '';

  sub!: Subscription;
  
  constructor( private adminService: AdminService, private authenticator: AuthenticatorService) {}


  set selectedRound( round: IRound ) {
    this._selectedRound = round;
    this.filteredMatches = this.performFilter(this._selectedRound);
  }

  get selectedRound() : IRound {
    return this._selectedRound;
  }

  ngOnInit(): void {
    
    this.sub = this.adminService.getMatches().subscribe({
      next: adr => {
        this.matches = adr.Items; 
        this.rounds = this.getRounds(this.matches);
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
    return this.deDuplicate( unsortedRounds);
  }

  deDuplicate( rounds : IRound[] ) : IRound[] {
    const ids = rounds.map(({ roundId }) => roundId );
    const filtered = rounds.filter(({ roundId }, index) => !ids.includes(roundId, index + 1));
    const sorted = filtered.sort( (elemA,elemB) => elemA.sortOrder - elemB.sortOrder );
    return sorted;
  }

  getCurrentRound() : IRound {
    return this.rounds? this.rounds[this.rounds.length - 1] : emptyRound() ;
  }

  performFilter(round: IRound) : IMatch[] {
    let ret = this.getMatchesByRound(this.matches,round);
    return ret;
  }

  getMatchesByRound( matches : IMatch[], round : IRound ) : IMatch[] {
    const ret = round? matches.filter((t: IMatch) => t.round.roundId === round.roundId ) : [];
    return ret;
  }
}
