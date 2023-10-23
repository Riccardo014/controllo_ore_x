import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { RtTableModule } from '@controllo-ore-x/rt-shared';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { GlobalTopbarComponent } from './components/global-topbar/global-topbar.component';
import { IndexTemplateComponent } from './components/index-template/index-template.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ReportFilterComponent } from './components/report-template/components/report-filter/report-filter.component';
import { ReportSingleFilterComponent } from './components/report-template/components/report-single-filter/report-single-filter.component';
import { ReportTemplateComponent } from './components/report-template/report-template.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RtHeaderModule } from './modules/rt-header/rt-header.module';
import { SidenavSectionComponent } from './components/sidenav/components/sidenav-section/sidenav-section.component';
import { ReportSingleFilterComponent } from './components/report-template/components/report-single-filter/report-single-filter.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { RangeDatepickerComponent } from './components/range-datepicker/range-datepicker.component';

@NgModule({
  declarations: [
    GlobalTopbarComponent,
    SidenavComponent,
    PageTitleComponent,
    IndexTemplateComponent,
    SidenavSectionComponent,
    ReportTemplateComponent,
    ReportFilterComponent,
    ReportSingleFilterComponent,
    DatepickerComponent,
    RangeDatepickerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatChipsModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    RtHeaderModule,
    RtTableModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  exports: [
    GlobalTopbarComponent,
    SidenavComponent,
    PageTitleComponent,
    IndexTemplateComponent,
    ReportTemplateComponent,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'it-IT' }],
})
export class SharedModule {}
