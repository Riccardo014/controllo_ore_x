import { Component, OnInit } from '@angular/core';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription, interval } from 'rxjs';
import { NavMenusVisibilityService } from '../sidenav/servicies/nav-menus-visibility.service';

@Component({
  selector: 'controllo-ore-x-global-topbar',
  templateUrl: './global-topbar.component.html',
  styleUrls: ['./global-topbar.component.scss'],
})
export class GlobalTopbarComponent implements OnInit, SubscriptionsLifecycle {
  currentTime: string = '';

  isSidenavOpen: boolean = true;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _sidenavService: NavMenusVisibilityService) {}

  setAutomaticTimerUpdate(): Subscription {
    return interval(1000)
      .pipe()
      .subscribe((_) => {
        this.currentTime = this.dateToString(new Date());
      });
  }

  dateToString(date: Date): string {
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');

    return hours + ':' + minutes;
  }

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._sidenavService.visibiliyObservable.subscribe(
        (isOpen) => (this.isSidenavOpen = isOpen),
      ),
      this.setAutomaticTimerUpdate(),
    );
  }

  toggleVisibility(): void {
    this._sidenavService.toggleVisibility();
  }
}
