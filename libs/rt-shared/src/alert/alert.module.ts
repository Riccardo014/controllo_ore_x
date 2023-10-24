import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertService } from './services/alert.service';

@NgModule({
  declarations: [AlertContainerComponent, AlertComponent],
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  providers: [AlertService],
  exports: [AlertContainerComponent],
})
export class AlertModule {}
