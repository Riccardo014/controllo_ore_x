import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RtHeaderComponent } from './components/rt-header/rt-header.component';

@NgModule({
  declarations: [RtHeaderComponent],
  exports: [RtHeaderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class RtHeaderModule {}
