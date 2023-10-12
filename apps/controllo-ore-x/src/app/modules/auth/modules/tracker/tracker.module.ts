import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerRoutingModule } from './tracker-routing.module';
import { MatChipsModule } from '@angular/material/chips';
import { TrackerIndexPage } from './pages/tracker-index/tracker-index.page';
import { SharedModule } from '@app/_shared/shared.module';
import { TrackerTableLineComponent } from './components/tracker-table-line/tracker-table-line.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AlertModule, RtDialogModule, RtInputModule, RtLoadingModule, RtSelectModule, RtTableModule } from '@controllo-ore-x/rt-shared';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    TrackerIndexPage,
    TrackerTableLineComponent,
  ],
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
  ],
})
export class TrackerModule {}

