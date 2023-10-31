import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HoursTagReadDto } from '@api-interfaces';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import {
  IRtDialogClose,
  IRtDialogInput,
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { HoursTagIcon } from 'apps/controllo-ore-x/src/assets/utils/datas/hoursTag-icon';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';

@Component({
  selector: 'controllo-ore-x-hoursTag-dialog',
  templateUrl: './hoursTag.dialog.html',
  styleUrls: ['./hoursTag.dialog.scss'],
})
export class HoursTagDialog {
  title: string = 'Nuova etichetta';
  transactionStatus: 'create' | 'update' = 'create';
  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = '';

  hoursTag?: HoursTagReadDto;

  hoursTagFormGroup: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    iconName: new FormControl(null, Validators.required),
    isModifiable: new FormControl(true, Validators.required),
  });

  icons: string[] = [...HoursTagIcon];

  constructor(
    private _hoursTagDataService: HoursTagDataService,
    public dialogRef: MatDialogRef<HoursTagDialog>,
    private _alertService: AlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: IRtDialogInput<HoursTagReadDto>,
    private _rtDialogService: RtDialogService,
  ) {
    if (this.data.input) {
      this.transactionStatus = 'update';
      this.title = 'Modifica etichetta';
      this.hoursTag = this.data.input;
      this.hoursTagFormGroup.patchValue(this.data.input);
      if (!this.data.input.isModifiable) {
        this.hoursTagFormGroup.disable();
        this.transactionStatus = 'create';
      }
    }
  }

  onDelete(): void {
    this._rtDialogService
      .openConfirmation(
        "Procedere con l'eliminazione?",
        "L'operazione non è reversibile",
      )
      .subscribe({
        next: (res) => {
          if (res?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this._delete();
          }
        },
      });
  }

  onCancel(): void {
    const modalRes: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CANCEL,
    };
    this.dialogRef.close(modalRes);
  }

  onSubmit(): void {
    this.hasErrors = false;

    if (!this.hoursTagFormGroup.get('isModifiable')?.value) {
      this.onCancel();
      return;
    }

    if (this.transactionStatus === 'update') {
      this._update();
      return;
    }

    this._create();
  }

  onReFetch(): void {
    window.location.reload();
  }

  getFormControlError(field: string, error: Error): boolean {
    return this.hoursTagFormGroup.controls[field].hasError(error.name);
  }

  compareIconFn(x: string, y: string): boolean {
    return x === y;
  }

  private _create(): void {
    this.hoursTagFormGroup.patchValue({
      isModifiable: true,
    });
    const hoursTagDto: HoursTagReadDto = this.hoursTagFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._hoursTagDataService.create(hoursTagDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = "Non è stato possibile creare l'etichetta";
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _update(): void {
    if (!this.hoursTag || this.transactionStatus === 'create') {
      return;
    }

    const hoursTagId: string = this.hoursTag._id;
    const hoursTagDto: HoursTagReadDto = this.hoursTagFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._hoursTagDataService.update(hoursTagId, hoursTagDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage =
          "Non è stato possibile aggiornare i dati dell'etichetta";
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _delete(): void {
    if (!this.hoursTag) {
      return;
    }

    const hoursTagId: string = this.hoursTag._id;

    this.isLoading = true;
    this.hasErrors = false;
    this._hoursTagDataService.delete(hoursTagId).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = "Non è stato possibile eliminare l'etichetta";
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
