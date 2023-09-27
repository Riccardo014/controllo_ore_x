import { Component, OnInit } from '@angular/core';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
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

  constructor(private _sidenavService: NavMenusVisibilityService) {
    let currentDateTime = new Date();
    setInterval(() => {
      currentDateTime = new Date();
      this.currentTime =
        (currentDateTime.getHours() < 10 ? '0' : '') +
        currentDateTime.getHours().toString() +
        ':' +
        (currentDateTime.getMinutes() < 10 ? '0' : '') +
        currentDateTime.getMinutes().toString();
    }, 1);
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
    );
  }

  toggleVisibility(): void {
    this._sidenavService.toggleVisibility();
  }
}
