import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RtLoadingComponent } from './components/rt-loading/rt-loading.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RtLoadingService } from './services/rt-loading.service';

@NgModule({
  declarations: [
    RtLoadingComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  providers: [
    RtLoadingService,
  ],
  exports: [
    RtLoadingComponent,
  ],
})
export class RtLoadingModule {}

