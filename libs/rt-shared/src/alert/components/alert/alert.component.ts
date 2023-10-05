import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, timeout } from 'rxjs';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '../../../../../../apps/controllo-ore-x/src/app/utils/subscriptions_lifecycle';
import { AlertService } from '../../services/alert.service';
import { RtAlert } from './alert.interface';

@Component({
  selector: 'lib-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  private readonly _ALERT_TIMEOUT: number = 5000;
  @Input() alert?: RtAlert;

  /**
   * How much time passed since the alert was created.
   */
  private _alertLifetimeElapsed: number = 0;

  /**
   * The total lifetime of the alert.
   */
  private _alertLifetimeTotal: number = this._ALERT_TIMEOUT;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  private _currentTimeout: any;
  private _currentInterval: any;
  isPinned: boolean = false;
  shouldShowDetails: boolean = false;

  constructor(private _rtAlertSvc: AlertService) {}

  ngOnInit(): void {
    if (!this.alert) {
      throw new Error('Alert is undefined');
    }
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(this.setTimeout());
    this.subscriptionsList.push(this.setInterval());
  }

  /**
   * Set the timeout for the alert lifetime
   */
  setTimeout(): Subscription {
    return interval(this._ALERT_TIMEOUT)
      .pipe(timeout(this._ALERT_TIMEOUT))
      .subscribe((_) => {
        this.close();
      });
  }

  /**
   * Set the interval for the alert lifetime progress bar
   */
  setInterval(): Subscription {
    return interval(100)
      .pipe()
      .subscribe((_) => {
        this._alertLifetimeElapsed -= 100;
      });
  }

  /**
   * If the alert is pinned, the interval and the timeout are cleared.
   */
  pin(): void {
    this.isPinned = true;
    clearInterval(this._currentInterval);
    clearTimeout(this._currentTimeout);
    this._completeSubscriptions(this.subscriptionsList);
  }

  /**
   * Close the alert
   */
  close(): void {
    this._completeSubscriptions(this.subscriptionsList);
    clearInterval(this._currentInterval);
    clearTimeout(this._currentTimeout);
    this._rtAlertSvc.removeArticle(this.alert!.id);
  }

  toggleDetails(): void {
    this.shouldShowDetails = !this.shouldShowDetails;
  }

  getLifetimeProgress(): number {
    return (this._alertLifetimeElapsed / this._alertLifetimeTotal) * 100;
  }
}
