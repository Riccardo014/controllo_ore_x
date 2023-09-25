import { Component, OnInit } from '@angular/core';
import { SubscriptionsLifecycle } from '@cox-interfaces';
import { NavMenusVisibilityService } from 'apps/controllo-ore-x/src/app/_shared/components/sidenav/servicies/nav-menus-visibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, SubscriptionsLifecycle {
  isSidebarOpen: boolean = true;

  subscriptionsList: Subscription[] = [];

  constructor(private _sidenavService: NavMenusVisibilityService) {}

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions();
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._sidenavService.areMenusVisibile.subscribe(
        (isOpen) => (this.isSidebarOpen = isOpen),
      ),
    );
  }

  _completeSubscriptions(): void {
    for (const subscription of this.subscriptionsList) {
      subscription.unsubscribe();
    }
  }
}
