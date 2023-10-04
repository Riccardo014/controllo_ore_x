import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
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

  /**
   * Open a dialog. If some of the config properties are left empty, defaults are used.
   *
   * @param title of the dialog
   * @param component that is used to display the dialog
   * @param config MatDialogConfig
   */
  open<TInput = any, TReturn = any>(
    title: string,
    component: ComponentType<any> | TemplateRef<any>,
    config: MatDialogConfig<TInput> = {},
  ): Observable<IRtDialogClose<TReturn>> {
    // Set the dialog's width.
    config.width = config?.width ?? this.DEFAULT_WIDTH;

    // Disable closing the dialog by clicking outside of it or by pressing ESC.
    config.disableClose = config?.disableClose ?? true;

    const dialogRef: MatDialogRef<ComponentType<any> | TemplateRef<any>> =
      this._matDialogSvc.open(component, {
        ...config,
        data: {
          input: config.data,
          title,
        },
      });
    return dialogRef.afterClosed() as Observable<IRtDialogClose<TReturn>>;
  }

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
