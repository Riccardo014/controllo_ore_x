import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectsReleaseTableLineComponent } from './modules/projects/components/projects-release-table-line/projects-release-table-line.component';
import { SharedModule } from '@app/_shared/shared.module';


@NgModule({
  declarations: [
    DashboardPage,
    ProjectsReleaseTableLineComponent,
  ],
  imports: [
    AuthRoutingModule,
    MatProgressBarModule,
    SharedModule,
  ],
  providers: [
  ],
})
export class AuthModule {}

