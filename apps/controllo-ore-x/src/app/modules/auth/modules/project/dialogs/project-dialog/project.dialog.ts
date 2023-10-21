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

  override isCreating: boolean = true;

  currentCustomer?: CustomerReadDto;
  customers: CustomerReadDto[] = [];

  currentColor?: string;
  colors: string[] = [
    ProjectColor.orange,
    ProjectColor.purple,
    ProjectColor.blue,
    ProjectColor.yellow,
    ProjectColor.green,
    ProjectColor.red,
  ];

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
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
    this._setSubscriptions();

    if (this.data.input) {
      this.formHelper.patchForm(this.data.input);
      this.currentColor = this.data.input.color;
      if (this.data.input.isDuplication) {
        this.title = 'Duplica progetto';
        return;
      }
      this.isCreating = false;
      this.formHelper.entityId = this.data.input._id;
      this.title = 'Modifica progetto';
    }
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(this._getProjectsCustomers());
  }

  override onSubmit(): void {
    if (!this.isCreating && this.data.input.isDuplication) {
      this.isCreating = true;
    }
    super.onSubmit();
  }

  override navigateAfterDelete(): void {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate(['/auth/progetti/']);
    });
  }

  openCreateCustomer(): void {
    this._rtDialogService
      .open(CustomerDialog, {
        width: '600px',
        maxWidth: '600px',
      })
      .subscribe();
  }

  /**
   * Fetch and set the project' customers from the database.
   */
  private _getProjectsCustomers(): Subscription {
    return this._customerDataService
      .getMany({})
      .subscribe((customers: ApiPaginatedResponse<CustomerReadDto>) => {
        this.customers = customers.data;
        if (this.formHelper.form.value.customer) {
          this.currentCustomer = this.customers.find(
            (customer: CustomerReadDto) =>
              customer._id === this.formHelper.form.value.customer._id,
          );
        }
      });
  }
}
