import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RtDialogConfirmationComponent } from '../components/rt-dialog-confirmation/rt-dialog-confirmation.component';
import { IRtDialogClose } from '../interfaces/i-rt-dialog-close.interface';

/**
 * Service to handle custom and default dialogs (open/close/return data)
 */
@Injectable()
export class RtDialogService {
  DEFAULT_WIDTH = '400px';
  CONFERMATION_WIDTH = '500px';
  constructor(private _matDialogSvc: MatDialog) {}

  openConfirmation(title: string, input?: string): Observable<IRtDialogClose> {
    const dialogRef: MatDialogRef<RtDialogConfirmationComponent> =
      this._matDialogSvc.open(RtDialogConfirmationComponent, {
        data: {
          title,
          input,
        },
        width: this.CONFERMATION_WIDTH,
      });
    return dialogRef.afterClosed() as Observable<IRtDialogClose>;
  }
}
