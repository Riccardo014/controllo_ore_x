import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRATION_MENU_SECTIONS } from '@app/_core/config/administration-menu-sections.config';
import { MAIN_MENU_SECTIONS } from '@app/_core/config/main-menu-sections.config';
import { MANAGEMENT_MENU_SECTIONS } from '@app/_core/config/management-menu-sections.config';
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
export class SidenavComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  MAIN_MENU_SECTIONS: IMenuSections[] = MAIN_MENU_SECTIONS;
  ADMINISTRATION_MENU_SECTIONS: IMenuSections[] = ADMINISTRATION_MENU_SECTIONS;
  MANAGEMENT_MENU_SECTIONS: IMenuSections[] = MANAGEMENT_MENU_SECTIONS;

  isSidenavOpen: boolean = true;

  activeSection: string;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _sidenavService: NavMenusVisibilityService,
  ) {
    this.activeSection = this._router.url.split('/')[2];
  }

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this.keepSidenavVisibilityInSync(),
      this.updateActiveSectionOnRouterEvent(),
    );
  }

  /**
   * Keep the sidenav visibility in sync with the sidenav service
   */
  keepSidenavVisibilityInSync(): Subscription {
    return this._sidenavService.visibiliyObservable.subscribe(
      (isOpen) => (this.isSidenavOpen = isOpen),
    );
  }

  /**
   * Update the active section on router event on router changes
   */
  updateActiveSectionOnRouterEvent(): Subscription {
    return this._router.events.subscribe(() => {
      this.activeSection = this.getActiveSectionFromUrl(this._router.url);
    });
  }

  /**
   * Get the active section from url
   */
  getActiveSectionFromUrl(url: string): string {
    return url.split('/')[2];
  }
}
