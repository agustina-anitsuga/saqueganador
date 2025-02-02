import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { AppComponent } from './app.component'; 
import { TutorialComponent } from './home/tutorial.component';
import { WelcomeComponent } from './home/welcome.component';
import { RankingModule } from './ranking/ranking.module';
import { BettingModule } from './betting/betting.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TutorialComponent
  ],
  imports: [
    NgxGoogleAnalyticsModule.forRoot('G-3SW2Z74M55'),
    NgxGoogleAnalyticsRouterModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
        { path: 'welcome', component: WelcomeComponent },
        { path: 'tutorial', component: TutorialComponent },
        { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
    ]),
    RankingModule,
    BettingModule,
    AuthModule,
    NgbModule,
    SharedModule,
    AdminModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
