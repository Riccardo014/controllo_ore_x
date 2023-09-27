/**
 * @version 1.0.0
 *
 * Snippet Name: RT Dialog Confirmation Component
 * Summary: Angular component
 * Description: used as fast custom component for RtDialogSvc.open for a chose (confirm/cancel)
 *
 * File Changelog
 *
 * Author                       | Date            | Changes
 * =====================================================================================================================
 * Luca Bertolini               | 02/04/2021      | Initial Import
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RT_DIALOG_CLOSE_RESULT } from '../../enums/rt-dialog-close-result.enum';
import { IRtDialogClose } from '../../interfaces/i-rt-dialog-close.interface';
import { IRtDialogInput } from '../../interfaces/i-rt-dialog-input.interface';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'rt-dialog-confirmation',
  templateUrl: './rt-dialog-confirmation.component.html',
  styleUrls: [
    './rt-dialog-confirmation.component.scss',
  ],
})
export class RtDialogConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<RtDialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput
  ) {}

  cancel(): void {
    const dialogClose: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CANCEL,
    };

    this.dialogRef.close(dialogClose);
  }

  confirm(): void {
    const dialogClose: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
    };

    this.dialogRef.close(dialogClose);
  }
}
