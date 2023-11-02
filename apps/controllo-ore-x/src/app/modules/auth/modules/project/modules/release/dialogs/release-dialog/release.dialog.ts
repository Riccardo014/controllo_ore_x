import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  IRtDialogClose,
  IRtDialogInput,
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';

@Component({
  selector: 'controllo-ore-x-release-dialog',
  templateUrl: './release.dialog.html',
  styleUrls: ['./release.dialog.scss'],
})
export class ReleaseDialog {
  title: string = 'Crea nuova release';
  transactionStatus: 'create' | 'update' = 'create';
  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = '';

  release?: ReleaseReadDto;

  releaseFormGroup: FormGroup = new FormGroup({
    projectId: new FormControl(null, Validators.required),
    name: new FormControl(null, Validators.required),
    hoursBudget: new FormControl(null, Validators.required),
    billableHoursBudget: new FormControl(null, Validators.required),
    deadline: new FormControl(null, Validators.required),
    isCompleted: new FormControl(null, Validators.required),
  });

  constructor(
    private _releaseDataService: ReleaseDataService,
    public dialogRef: MatDialogRef<ReleaseDialog>,
    private _alertService: AlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: IRtDialogInput<any>,
    private _rtDialogService: RtDialogService,
  ) {
    if (this.data.input.transactionStatus === 'create') {
      this.releaseFormGroup.patchValue({
        projectId: this.data.input.projectId,
        isCompleted: false,
      });
      return;
    }
    if (this.data.input) {
      this.transactionStatus = 'update';
      this.title = 'Modifica release';
      this.release = this.data.input;
      this.releaseFormGroup.patchValue(this.data.input);
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
        error: (error: any) => {
          throw new Error(error);
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
    return this.releaseFormGroup.controls[field].hasError(error.name);
  }

  private _create(): void {
    const releaseDto: ReleaseReadDto = this.releaseFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._releaseDataService.create(releaseDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = 'Non è stato possibile creare la release';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _update(): void {
    if (!this.release || this.transactionStatus === 'create') {
      return;
    }

    const releaseId: string = this.release._id;
    const releaseDto: ReleaseReadDto = this.releaseFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._releaseDataService.update(releaseId, releaseDto).subscribe({
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
          'Non è stato possibile aggiornare i dati della release';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _delete(): void {
    if (!this.release) {
      return;
    }

    const releaseId: string = this.release._id;

    this.isLoading = true;
    this.hasErrors = false;
    this._releaseDataService.delete(releaseId).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = 'Non è stato possibile eliminare la release';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
