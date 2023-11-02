import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RT_DIALOG_CLOSE_RESULT } from '../../enums/rt-dialog-close-result.enum';
import { IRtDialogClose } from '../../interfaces/i-rt-dialog-close.interface';
import { IRtDialogInput } from '../../interfaces/i-rt-dialog-input.interface';

@Component({
  selector: 'lib-rt-dialog-confirmation',
  templateUrl: './rt-dialog-confirmation.component.html',
  styleUrls: ['./rt-dialog-confirmation.component.scss'],
})
export class RtDialogConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<RtDialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput,
  ) {}

  cancelProcess(): void {
    const dialogClose: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CANCEL,
    };

    this.dialogRef.close(dialogClose);
  }

  confirmProcess(): void {
    const dialogClose: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
    };

    this.dialogRef.close(dialogClose);
  }
}
