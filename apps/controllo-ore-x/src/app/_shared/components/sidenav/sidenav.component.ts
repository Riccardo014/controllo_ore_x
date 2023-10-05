import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { NavMenusVisibilityService } from './servicies/nav-menus-visibility.service';

@Component({
  selector: 'controllo-ore-x-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  isSidenavOpen: boolean = true;

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
      this._sidenavService.visibiliyObservable.subscribe(
        (isOpen) => (this.isSidenavOpen = isOpen),
      ),
    );
  }
}
