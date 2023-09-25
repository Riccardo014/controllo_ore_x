import { Component, OnInit } from '@angular/core';
import { NavMenusVisibilityService } from './servicies/nav-menus-visibility.service';
import { SubscriptionsLifecycle } from '@cox-interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, SubscriptionsLifecycle {
  isSidenavOpen: boolean = true;

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
      this._sidenavService.visibiliyObservable.subscribe(
        (isOpen) => (this.isSidenavOpen = isOpen),
      ),
    );
  }

  _completeSubscriptions(): void {
    for (const subscription of this.subscriptionsList) {
      subscription.unsubscribe();
    }
  }
}
