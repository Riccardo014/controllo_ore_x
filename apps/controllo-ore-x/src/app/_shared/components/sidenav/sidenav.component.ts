import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRATION_MENU } from '@app/_core/config/administration-menu.config';
import { MAIN_MENU } from '@app/_core/config/main-menu.config';
import { MANAGEMENT_MENU } from '@app/_core/config/management-menu.config';
import { IMenuSections } from '@app/_core/interfaces/i-menu-sections.interface';
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
export class SidenavComponent implements OnInit, SubscriptionsLifecycle {
  MAIN_MENU: IMenuSections[] = MAIN_MENU;
  ADMINISTRATION_MENU: IMenuSections[] = ADMINISTRATION_MENU;
  MANAGEMENT_MENU: IMenuSections[] = MANAGEMENT_MENU;

  isSidenavOpen: boolean = true;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _sidenavService: NavMenusVisibilityService,
  ) {}

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

  setActiveVoice(routerLink: string | undefined): boolean {
    if (!routerLink) {
      return false;
    }

    const currentUrl: string = this._router.url;
    if (!currentUrl.includes(routerLink)) {
      return false;
    }

    //* this condition is to avoid multiple active voices on sidebar
    if (routerLink === 'documenti' && currentUrl.includes('i-miei-documenti')) {
      return false;
    }

    return true;
  }
}
