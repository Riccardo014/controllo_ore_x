import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterLinkWithHref } from '@angular/router';
import { RtFilterComponent } from './components/rt-filter/rt-filter.component';
import { RtTableFulltextBarComponent } from './components/rt-table-fulltext-bar/rt-table-fulltext-bar.component';
import { RtTableTdComponent } from './components/rt-table-td/rt-table-td.component';
import { RtTableThComponent } from './components/rt-table-th/rt-table-th.component';
import { RtTableComponent } from './components/rt-table/rt-table.component';

@NgModule({
  declarations: [
    RtTableComponent,
    RtTableFulltextBarComponent,
    RtFilterComponent,
    RtTableThComponent,
    RtTableTdComponent,
  ],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatIconModule,
    MatPaginatorModule,
    RouterLinkWithHref,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  exports: [RtTableComponent, RtTableFulltextBarComponent],
  providers: [],
})
export class RtTableModule {}
