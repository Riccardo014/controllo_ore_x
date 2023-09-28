/**
 * @version 1.0.0
 *
 * Snippet Name: RT Dialog Service
 * Summary: Wrapper for Mat Dialog service
 * Description: used to handle custom and default dialogs (open/close/return data)
 *
 * File Changelog
 *
 * Author                       | Date            | Changes
 * =====================================================================================================================
 * Luca Bertolini               | 02/04/2021      | Initial Import
 */

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

@Injectable()
export class RtDialogService {
  constructor(private _matDialogSvc: MatDialog) {}

  /**
   * default width is 400px
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
    // set default width to 450px
    config.width = config?.width ?? '400px';

    // disable close dialog by click out or clicking esc
    config.disableClose = config?.disableClose ?? true;

    // overwrite/write title inside config.data
    // put data inside input to be conform with TInput interface
    const data: { input: TInput | null | undefined; title: string } = {
      input: config.data,
      title,
    };

    const dialogRef: MatDialogRef<ComponentType<any> | TemplateRef<any>> =
      this._matDialogSvc.open(component, {
        ...config,
        data,
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
        width: '500px',
      });
    return dialogRef.afterClosed() as Observable<IRtDialogClose>;
  }
}
