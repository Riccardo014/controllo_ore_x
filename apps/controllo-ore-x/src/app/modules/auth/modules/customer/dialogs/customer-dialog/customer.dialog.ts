import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CustomerCreateDto,
  CustomerReadDto,
  CustomerUpdateDto,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { BaseDialog } from '@app/_shared/classes/base-dialog.class';
import { IRtDialogInput, RtDialogService } from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { CustomerFormHelper } from '../../helpers/customer.form-helper';

@Component({
  selector: 'controllo-ore-x-customer-dialog',
  templateUrl: './customer.dialog.html',
  styleUrls: ['./customer.dialog.scss'],
  providers: [CustomerFormHelper],
})
export class CustomerDialog
  extends BaseDialog<CustomerReadDto, CustomerCreateDto, CustomerUpdateDto>
  implements OnInit
{
  override title: string = 'Inserisci un nuovo cliente';

  constructor(
    public override formHelper: CustomerFormHelper,
    protected override _formBuilder: FormBuilder,
    protected _matDialogRef: MatDialogRef<CustomerDialog>,
    private _customerDataService: CustomerDataService,
    private _rtDialogService: RtDialogService,
    private _alertService: AlertService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
  ) {
    super(formHelper, _formBuilder, _rtDialogService, _alertService, _router);
  }

  ngOnInit(): void {
    if (this.data.input) {
      this.transactionStatus = 'update';
      this.formHelper.patchForm(this.data.input);
      this.formHelper.entityId = this.data.input._id;
      this.title = 'Modifica cliente';
    }
  }
}
