import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerRoutingModule } from './tracker-routing.module';
import { TrackerTableLineComponent } from './components/tracker-table-line/tracker-table-line.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    TrackerTableLineComponent
  ],
  imports: [
    CommonModule,
    TrackerRoutingModule,
    MatChipsModule,
  ],
})
export class TrackerModule {}

