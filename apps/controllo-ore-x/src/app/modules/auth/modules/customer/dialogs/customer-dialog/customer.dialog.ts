import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerReadDto } from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import {
  IRtDialogClose,
  IRtDialogInput,
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';

@Component({
  selector: 'controllo-ore-x-customer-dialog',
  templateUrl: './customer.dialog.html',
  styleUrls: ['./customer.dialog.scss'],
})
export class CustomerDialog {
  title: string = 'Inserisci un nuovo cliente';
  transactionStatus: 'create' | 'update' = 'create';
  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = '';

  customer?: CustomerReadDto;

  customerFormGroup: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  constructor(
    private _customerDataService: CustomerDataService,
    public dialogRef: MatDialogRef<CustomerDialog>,
    private _alertService: AlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: IRtDialogInput<any>,
    private _rtDialogService: RtDialogService,
  ) {
    if (this.data.input) {
      this.transactionStatus = 'update';
      this.title = 'Modifica cliente';
      this.customer = this.data.input;
      this.customerFormGroup.patchValue(this.data.input);
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
    return this.customerFormGroup.controls[field].hasError(error.name);
  }

  private _create(): void {
    const customerDto: CustomerReadDto = this.customerFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._customerDataService.create(customerDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this.errorMessage = 'Non è stato possibile creare il cliente';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _update(): void {
    if (!this.customer || this.transactionStatus === 'create') {
      return;
    }

    const customerId: string = this.customer._id;
    const customerDto: CustomerReadDto = this.customerFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._customerDataService.update(customerId, customerDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this.errorMessage = 'Non è stato possibile aggiornare i dati del cliente';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _delete(): void {
    if (!this.customer) {
      return;
    }

    const customerId: string = this.customer._id;

    this.isLoading = true;
    this.hasErrors = false;
    this._customerDataService.delete(customerId).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this.errorMessage = 'Non è stato possibile eliminare il cliente';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
