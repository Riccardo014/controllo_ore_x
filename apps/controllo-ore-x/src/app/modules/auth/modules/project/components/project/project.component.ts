import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerReadDto, ProjectReadDto } from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() project!: ProjectReadDto;
  customer: CustomerReadDto = {} as CustomerReadDto;

  isPanelOpen: boolean = false;
  customExpandedHeight: string = '90px';

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _customerDataService: CustomerDataService, 
    private _router: Router) {}

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._customerDataService.getOne(this.project.customerId).subscribe({
        next: (customer: any) => {
          this.customer = customer;
        },
      }),
    );
  }

  openDialogFn(): void {
    this._router.navigate([this._router.url + '/' + this.project._id]);
  }

  openCreateReleaseDialog(): void {
  this._router.navigate([this._router.url + '/' + this.project._id + '/release/' + '/create']);
  }

}
