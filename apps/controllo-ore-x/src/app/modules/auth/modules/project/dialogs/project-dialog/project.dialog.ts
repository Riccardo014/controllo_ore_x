import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  CustomerReadDto,
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { BaseDialog } from '@app/_shared/classes/base-dialog.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { IRtDialogInput, RtDialogService } from '@controllo-ore-x/rt-shared';
import { ProjectColor } from 'apps/controllo-ore-x/src/assets/utils/datas/project-color';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { Subscription } from 'rxjs';
import { CustomerDialog } from '../../../customer/dialogs/customer-dialog/customer.dialog';
import { ProjectFormHelper } from '../../helpers/project.form-helper';

@Component({
  selector: 'controllo-ore-x-project-dialog',
  templateUrl: './project.dialog.html',
  styleUrls: ['./project.dialog.scss'],
  providers: [ProjectFormHelper],
})
export class ProjectDialog
  extends BaseDialog<ProjectReadDto, ProjectCreateDto, ProjectUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  override title: string = 'Crea nuovo progetto';

  /**
   * The customer selected by the user to edit.
   */
  userSelectedCustomer?: CustomerReadDto;
  projectCustomers: CustomerReadDto[] = [];

  /**
   * The customer's color to edit.
   */
  userSelectedColor?: string;
  colors: string[] = [...ProjectColor];

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: ProjectFormHelper,
    protected override _formBuilder: FormBuilder,
    protected _matDialogRef: MatDialogRef<ProjectDialog>,
    private _rtDialogService: RtDialogService,
    private _alertService: AlertService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
    private _customerDataService: CustomerDataService,
  ) {
    super(formHelper, _formBuilder, _rtDialogService, _alertService, _router);
  }

  ngOnInit(): void {
    this.setSubscriptions();

    if (this.data.input) {
      this.formHelper.patchForm(this.data.input);
      this.userSelectedColor = this.data.input.color;
      if (this.data.input.isDuplication) {
        this.title = 'Duplica progetto';
        return;
      }
      this.transactionStatus = 'update';
      this.formHelper.entityId = this.data.input._id;
      this.title = 'Modifica progetto';
    }
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._fetchSetProjectCustomers());
  }

  override onSubmit(): void {
    if (this.transactionStatus === 'update' && this.data.input.isDuplication) {
      this.transactionStatus = 'create';
    }
    super.onSubmit();
  }

  openCreateCustomerDialog(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(CustomerDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
        })
        .subscribe(),
    );
  }

  /**
   * Fetch and set the project's customers.
   */
  private _fetchSetProjectCustomers(): Subscription {
    return this._customerDataService
      .getMany({})
      .subscribe((customers: ApiPaginatedResponse<CustomerReadDto>) => {
        this.projectCustomers = customers.data;
        if (this.formHelper.form.value.customer) {
          this.userSelectedCustomer = this.projectCustomers.find(
            (customer: CustomerReadDto) =>
              customer._id === this.formHelper.form.value.customer._id,
          );
        }
      });
  }
}
