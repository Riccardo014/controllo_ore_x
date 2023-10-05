import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '@app/_shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';

@NgModule({
  declarations: [DashboardPage],
  imports: [
    AuthRoutingModule,
    MatProgressBarModule,
    SharedModule,
    MatButtonModule,
  ],
  providers: [],
})
export class AuthModule {}
