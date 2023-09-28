import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RtDialogModule, RtTableModule } from '@controllo-ore-x/rt-shared';
import { SharedModule } from '@shared/shared.module';
import { UserInsertUpsertDialog } from './dialogs/user-insert-upsert/user-insert-upsert.dialog';
import { TeamIndexPage } from './pages/team-index.page';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [TeamIndexPage, UserInsertUpsertDialog],
  imports: [
    CommonModule,
    TeamRoutingModule,
    MatChipsModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
    RtTableModule,
    MatFormFieldModule,
    MatSelectModule,
    RtDialogModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class TeamModule {}
