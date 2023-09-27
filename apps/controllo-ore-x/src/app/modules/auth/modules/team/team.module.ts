import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RtTableModule } from '@controllo-ore-x/rt-shared';
import { SharedModule } from '@shared/shared.module';
import { TeamIndexPage } from './pages/team-index.page';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [TeamIndexPage],
  imports: [
    CommonModule,
    TeamRoutingModule,
    MatChipsModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
    RtTableModule,
  ],
})
export class TeamModule {}
