import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CustomerCreateDto,
  CustomerReadDto,
  CustomerUpdateDto,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { Subscription } from 'rxjs';
import { CustomerFormHelper } from '../../helpers/customer.form-helper';

@Component({
  selector: 'controllo-ore-x-customer-upsert',
  templateUrl: './customer-upsert.page.html',
  styleUrls: ['./customer-upsert.page.scss'],
  providers: [CustomerFormHelper],
})
export class CustomerUpsertPage
  extends UpsertPage<CustomerReadDto, CustomerCreateDto, CustomerUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  override title: string = 'Inserisci un nuovo cliente';

  isPasswordVisible: boolean = false;
  customerId?: string | number;
  currentRole?: string;

  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: CustomerFormHelper,
    private _customerDataService: CustomerDataService,
    private _alertService: AlertService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(
      formHelper,
      _alertService,
      _rtDialogService,
      _router,
      _activatedRoute,
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._setSubscriptions();

    if (!this.isCreating) {
      this.title = 'Modifica cliente';
    }
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    if (!this.isCreating) {
      this.customerId = this.formHelper.entityId;
      this.subscriptionsList.push(this._getCustomer());
    }
  }

  private _getCustomer(): Subscription {
    if (!this.customerId) {
      throw new Error('Non è stato possibile recuperare i dati del cliente');
    }
    return this._customerDataService
      .getOne(this.customerId)
      .subscribe((customer: any) => {
        this.formHelper.patchForm(customer);
      });
  }
}
