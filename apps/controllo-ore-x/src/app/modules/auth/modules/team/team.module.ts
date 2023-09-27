import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '@shared/shared.module';
import { TeamIndexPage } from './pages/team-index.page';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [TeamIndexPage],
  imports: [CommonModule, TeamRoutingModule, MatChipsModule, SharedModule],
})
export class TeamModule {}
