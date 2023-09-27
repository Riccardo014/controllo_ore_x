/**
 * @version 1.0.0
 *
 * Snippet Name: RT Dialog Module
 * Summary: Wrapper for Mat Dialog
 * Description: used to handle dialog
 *
 * File Changelog
 *
 * Author                       | Date            | Changes
 * =====================================================================================================================
 * Luca Bertolini               | 02/04/2021      | Initial Import
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RtDialogConfirmationComponent } from './components/rt-dialog-confirmation/rt-dialog-confirmation.component';
import { RtDialogDefaultActionsComponent } from './components/rt-dialog-default-actions/rt-dialog-default-actions.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RtDialogTemplateComponent } from './components/rt-dialog-template/rt-dialog-template.component';
import { RtDialogService } from './services/rt-dialog.service';

@NgModule({
  declarations: [
    RtDialogTemplateComponent,
    RtDialogDefaultActionsComponent,
    RtDialogConfirmationComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    RtDialogService,
  ],
  exports: [
    RtDialogTemplateComponent,
    RtDialogDefaultActionsComponent,
    RtDialogConfirmationComponent,
  ],
})
export class RtDialogModule {}

