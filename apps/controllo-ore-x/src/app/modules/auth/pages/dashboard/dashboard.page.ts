import { Component, OnInit } from '@angular/core';
import { UserReadDto } from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
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
export class DashboardPage implements OnInit, SubscriptionsLifecycle {
  isSidebarOpen: boolean = true;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;
  user?: UserReadDto;

  constructor(
    private _sidenavService: NavMenusVisibilityService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this._setSubscriptions();

    this.user = this._authService.loggedInUser;
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
