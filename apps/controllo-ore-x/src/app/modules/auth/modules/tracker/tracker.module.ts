import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@app/_shared/shared.module';
import {
  AlertModule,
  RtDialogModule,
  RtInputModule,
  RtLoadingModule,
  RtSelectModule,
  RtTableModule,
} from '@controllo-ore-x/rt-shared';
import { TrackerTableLineComponent } from './components/tracker-table-line/tracker-table-line.component';
import { TrackerDialog } from './dialogs/tracker-dialog/tracker.dialog';
import { TrackerIndexPage } from './pages/tracker-index/tracker-index.page';
import { TrackerRoutingModule } from './tracker-routing.module';

@NgModule({
  declarations: [TrackerIndexPage, TrackerTableLineComponent, TrackerDialog],
  imports: [
    CommonModule,
    TrackerRoutingModule,
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
    RtInputModule,
    RtLoadingModule,
    AlertModule,
    RtSelectModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
  ],
})
export class TrackerModule {}
