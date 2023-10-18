import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserReadDto } from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription, interval } from 'rxjs';
import { NavMenusVisibilityService } from '../sidenav/services/nav-menus-visibility.service';

@Component({
  selector: 'controllo-ore-x-global-topbar',
  templateUrl: './global-topbar.component.html',
  styleUrls: ['./global-topbar.component.scss'],
})
export class GlobalTopbarComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  currentTime: string = '';

  user?: UserReadDto;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _sidenavService: NavMenusVisibilityService,
    private _authService: AuthService,
  ) {
    this.user = this._authService.loggedInUser;
  }

  setAutomaticTimerUpdate(): Subscription {
    return interval(1000).subscribe((_) => {
      this.currentTime = this.dateToString(new Date());
    });
  }

  dateToString(date: Date): string {
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');

    return hours + ':' + minutes;
  }

  ngOnInit(): void {
    if (!this.user) {
      throw new Error('User is not logged in');
    }
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this.setAutomaticTimerUpdate());
  }

  toggleVisibility(): void {
    this._sidenavService.toggleVisibility();
  }

  logout(): void {
    this._authService.logout();
  }
}
