import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class DashboardPage
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  isSidebarOpen: boolean = true;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;
  user?: UserReadDto;

  constructor(
    private _sidenavService: NavMenusVisibilityService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.setSubscriptions();

    this.user = this._authService.loggedInUser;
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this._sidenavService.areMenusVisibile.subscribe(
        (isOpen) => (this.isSidebarOpen = isOpen),
      ),
    );
  }
}
