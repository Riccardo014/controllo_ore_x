import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenuSections } from '@app/_core/interfaces/i-menu-sections.interface';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.scss'],
})
export class SidenavSectionComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() MENU_SECTIONS!: IMenuSections[];

  selectedSection: string;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _router: Router) {
    this.selectedSection = this._router.url.split('/')[2];
  }

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._router.events.subscribe(() => {
        this.selectedSection = this._router.url.split('/')[2];
      }),
    );
  }
}
