import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { RtAlert } from '../alert/alert.interface';

@Component({
  selector: 'lib-alert-container',
  templateUrl: './alert-container.component.html',
  styleUrls: ['./alert-container.component.scss'],
})
export class AlertContainerComponent implements OnInit {
  alerts: RtAlert[] = [];

  constructor(private _rtAlert: AlertService) {}

  ngOnInit(): void {
    this._rtAlert.alerts.subscribe((alert) => {
      this.alerts = alert;
    });
  }
}
