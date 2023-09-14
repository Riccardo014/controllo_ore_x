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
import { CustomerTableLineComponent } from './modules/auth/modules/customer/components/customer-table-line/customer-table-line.component';
import { GlobalTopbarComponent } from './_shared/components/global-topbar/global-topbar.component';
import { MatMenuModule } from '@angular/material/menu';
import { SidenavComponent } from './_shared/components/sidenav/sidenav.component';
import { PageTitleComponent } from './_shared/components/page-title/page-title.component';
import { ProjectsTableHeaderComponent } from './modules/auth/modules/projects/components/projects-table-header/projects-table-header.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackerTableLineComponent,
    ProjectsReleaseTableLineComponent,
    TeamTableLineComponent,
    CustomerTableLineComponent,
    GlobalTopbarComponent,
    SidenavComponent,
    PageTitleComponent,
    ProjectsTableHeaderComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
