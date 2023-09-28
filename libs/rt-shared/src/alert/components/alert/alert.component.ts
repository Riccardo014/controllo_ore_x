import { Component, Input, OnInit } from '@angular/core';
import { RtAlert } from './alert.interface';
import { AlertService } from "../../services/alert.service";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lib-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss',],
})
export class AlertComponent implements OnInit {
  static readonly ALERT_TIMEOUT: number = 5000;
  @Input() alert!: RtAlert;

  currentPosition: number = AlertComponent.ALERT_TIMEOUT;
  total: number = AlertComponent.ALERT_TIMEOUT;

  currentTimeout: any;
  currentInterval: any;
  isPinned: boolean = false;
  shouldShowDetails: boolean = false;

  constructor(private _rtAlertSvc: AlertService) {
  }

  ngOnInit(): void {
    this.currentTimeout = setTimeout(() => {
      this.close();
    }, AlertComponent.ALERT_TIMEOUT);

    this.currentInterval = setInterval(() => {
      this.currentPosition -= 100;
    }, 100);
  }

  pin(): void {
    this.isPinned = true;
    clearInterval(this.currentInterval);
    clearTimeout(this.currentTimeout);
  }

  close(): void {
    clearInterval(this.currentInterval);
    clearTimeout(this.currentTimeout);
    this._rtAlertSvc.removeValue(this.alert.id);
  }

  toggleDetails(): void {
    this.shouldShowDetails = !this.shouldShowDetails;
  }
}
