import { Component, OnInit } from '@angular/core';
import { RtAlert } from "../alert/alert.interface";
import { AlertService } from "../../services/alert.service";


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lib-alert-container',
  templateUrl: './alert-container.component.html',
  styleUrls: ['./alert-container.component.scss',],
})
export class AlertContainerComponent implements OnInit {
  currentAlerts: RtAlert[] = [];

  constructor(private _rtAlert: AlertService) {
  }

  ngOnInit(): void {
    this._rtAlert.alerts.subscribe(r => {
      this.currentAlerts = r;
    });
  }

}
