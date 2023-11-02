import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertContainerComponent } from './components/alert-container/alert-container.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from './services/alert.service';

@NgModule({
  declarations: [AlertContainerComponent, AlertComponent],
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  providers: [AlertService],
  exports: [AlertContainerComponent],
})
export class AlertModule {}
