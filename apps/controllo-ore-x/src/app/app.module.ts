import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TrackerTableLineComponent } from './modules/auth/modules/tracker/components/tracker-table-line/tracker-table-line.component';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectsReleaseTableLineComponent } from './modules/auth/modules/projects/components/projects-release-table-line/projects-release-table-line.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { TeamTableLineComponent } from './modules/auth/modules/team/components/team-table-line/team-table-line.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackerTableLineComponent,
    ProjectsReleaseTableLineComponent,
    TeamTableLineComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
