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

@Injectable({ providedIn: 'root' })
export class RtDialogService {
  DEFAULT_WIDTH = '400px';
  CONFERMATION_WIDTH = '600px';
  constructor(private _matDialogSvc: MatDialog) {}

  /**
   * default width is 400px
   *
   * @param component that is used to display the dialog
   * @param config MatDialogConfig
   */
  open<TInput = any, TReturn = any>(
    component: ComponentType<any> | TemplateRef<any>,
    config: MatDialogConfig<TInput> = {},
  ): Observable<IRtDialogClose<TReturn>> {
    // set default width to 450px
    config.width = config?.width ?? this.DEFAULT_WIDTH;

    config.maxWidth = '94%';

    // disable close dialog by click out or clicking esc
    config.disableClose = config?.disableClose ?? true;

    // overwrite/write title inside config.data
    // put data inside input to be conform with TInput interface
    const data: { input: TInput | null | undefined } = {
      input: config.data,
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
        width: this.CONFERMATION_WIDTH,
      });
    return dialogRef.afterClosed() as Observable<IRtDialogClose>;
  }
}
