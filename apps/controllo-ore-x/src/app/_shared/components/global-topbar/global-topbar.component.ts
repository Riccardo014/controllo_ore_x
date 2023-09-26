import { Component, OnInit } from '@angular/core';
import { NavMenusVisibilityService } from '../sidenav/servicies/nav-menus-visibility.service';
import { SubscriptionsLifecycle } from '@cox-interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-global-topbar',
  templateUrl: './global-topbar.component.html',
  styleUrls: ['./global-topbar.component.scss'],
})
export class GlobalTopbarComponent implements OnInit, SubscriptionsLifecycle {

  currentTime: string = '';

  isSidenavOpen: boolean = true;

  subscriptionsList: Subscription[] = [];

  constructor(private _sidenavService: NavMenusVisibilityService) {
    let currentDateTime = new Date();
    setInterval(() => {
      currentDateTime = new Date();
      this.currentTime = 
        currentDateTime.getHours().toString()+ ':' + 
        (currentDateTime.getMinutes()<10?'0':'') + currentDateTime.getMinutes().toString();
    }, 1);
  }

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

  toggleVisibility(): void {
    this._sidenavService.toggleVisibility();
  }
}
