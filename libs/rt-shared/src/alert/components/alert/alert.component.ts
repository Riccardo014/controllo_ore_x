import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, interval, timeout } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { RtAlert } from './alert.interface';

@Component({
  selector: 'lib-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent
  implements OnInit, OnDestroy
{
  destroy$: Subject<boolean> = new Subject();
  isPinned: boolean = false;
  shouldShowDetails: boolean = false;

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


  private _currentTimeout: any;
  private _currentInterval: any;

  constructor(private _rtAlertSvc: AlertService) {}

  ngOnInit(): void {
    if (!this.alert) {
      throw new Error('Alert is undefined');
    }
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  setSubscriptions(): void {
    this._currentTimeout = this.setTimeout();
    this._currentInterval = this.setInterval();
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
    this.destroy$.next(true);
  }

  /**
   * Close the alert
   */
  close(): void {
    this.destroy$.next(true);
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
