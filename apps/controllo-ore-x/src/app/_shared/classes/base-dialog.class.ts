import { Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IRtDialogClose,
  RT_DIALOG_CLOSE_RESULT,
  RtDialogForm,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { UpsertFormHelper } from './upsert-form-helper.class';

/**
 * It's a helper class to manage the upsert pages.
 */
@Directive()
export abstract class BaseDialog<
  ReadT extends { _id: string },
  CreateT,
  UpdateT,
> extends RtDialogForm {
  title: string = 'Dialog title';

  isCreating: boolean = true;

  constructor(
    public formHelper: UpsertFormHelper<ReadT, CreateT, UpdateT>,
    protected _formBuilder: FormBuilder,
    private _baseDialogDialogSvc: RtDialogService,
    private _baseDialogAlertSvc: AlertService,
    private _baseDialogrouter: Router,
  ) {
    super();
  }

  onSubmit(): void {
    if (this.formHelper.invalid) {
      return;
    }
    this.isLoading = true;

    this.formHelper.disable();

    this.isCreating ? this._createEntity() : this._updateEntity();
  }

  deleteEntity(): void {
    this._baseDialogDialogSvc
      .openConfirmation(
        "Procedere con l'eliminazione?",
        "L'operazione non è reversibile",
      )
      .subscribe({
        next: async (closeResult: IRtDialogClose) => {
          if (closeResult?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.isLoading = true;
            this.formHelper.disable();
            try {
              await this.formHelper.delete();
              this._baseDialogAlertSvc.openSuccess();
              this.cancel();
              this.navigateAfterDelete();
            } catch (err) {
              this.isLoading = false;
              this.formHelper.enable();

              this._baseDialogAlertSvc.openError(
                'Errore!',
                'Impossibile terminare la procedura',
                err,
              );
            }
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  navigateAfterDelete(): void {
    const currentUrl = this._baseDialogrouter.url;
    this._baseDialogrouter
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this._baseDialogrouter.navigate([`/${currentUrl}`]);
      });
  }

  private async _createEntity(): Promise<void> {
    if (this.formHelper.invalid) {
      throw new Error('The form is not valid');
    }

    this.isLoading = true;
    this.formHelper.disable();

    try {
      await this.formHelper.create();
      this.isLoading = false;
      this._baseDialogAlertSvc.openSuccess();
      this.cancel();
      const currentUrl = this._baseDialogrouter.url;
      this._baseDialogrouter
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => {
          this._baseDialogrouter.navigate([`/${currentUrl}`]);
        });
    } catch (err) {
      this.formHelper.enable();
      this._baseDialogAlertSvc.openError(
        'Errore',
        "Impossibile creare l'entità",
        err,
      );
      this.isLoading = false;
    }
  }

  private async _updateEntity(): Promise<void> {
    if (this.formHelper.invalid) {
      return;
    }

    this.isLoading = true;
    this.formHelper.disable();

    try {
      await this.formHelper.update();
      await this.formHelper.loadData();
      this.isLoading = false;
      this.formHelper.disable();

      this._baseDialogAlertSvc.openSuccess();
      this.cancel();
      const currentUrl = this._baseDialogrouter.url;
      this._baseDialogrouter
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => {
          this._baseDialogrouter.navigate([`/${currentUrl}`]);
        });
    } catch (err) {
      this.isLoading = false;
      this.formHelper.enable();
      this._baseDialogAlertSvc.openError(
        'Errore',
        "Impossibile aggiornare l'entità",
        err,
      );
    }
  }
}
