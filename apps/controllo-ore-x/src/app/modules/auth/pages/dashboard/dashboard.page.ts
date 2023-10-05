import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { NavMenusVisibilityService } from 'apps/controllo-ore-x/src/app/_shared/components/sidenav/servicies/nav-menus-visibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  isSidebarOpen: boolean = true;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _sidenavService: NavMenusVisibilityService) {}

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._sidenavService.areMenusVisibile.subscribe(
        (isOpen) => (this.isSidebarOpen = isOpen),
      ),
    );
  }
}
