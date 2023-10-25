import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '@app/_shared/shared.module';
import {
  RtDialogModule,
  RtInputModule,
  RtLoadingModule,
  RtSelectModule,
  RtTableModule,
} from '@controllo-ore-x/rt-shared';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DayoffRoutingModule } from './dayoff-routing.module';
import { DayoffDialog } from './dialogs/dayoff-dialog/dayoff.dialog';
import { DayoffIndexPage } from './pages/dayoff-index/dayoff-index.page';

@NgModule({
  declarations: [DayoffIndexPage, DayoffDialog],
  imports: [
    CommonModule,
    DayoffRoutingModule,
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
    RtSelectModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    NgxMaterialTimepickerModule,
    MatSlideToggleModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'it-IT' }],
})
export class DayoffModule {}
