import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RtAlert } from '../components/alert/alert.interface';

@Injectable({ providedIn: 'root' })
export class AlertService {
  alerts: BehaviorSubject<RtAlert[]> = new BehaviorSubject([] as RtAlert[]);

  /**
   * Keep track of the id of the last alert to give them session-wise serial ids.
   */
  private _lastAlertId: number = 0;

  getAlert(): RtAlert[] {
    return this.alerts.getValue();
  }

  addAlert(alert: RtAlert): void {
    this.alerts.next(this.alerts.getValue().concat([alert]));
  }

  openSuccess(
    title: string = 'Ottimo!',
    text: string = 'Procedura completata con successo.',
    details?: any,
  ): void {
    const currentValue: number = this._lastAlertId++;
    this.addAlert({
      id: currentValue,
      type: 'success',
      text,
      title,
      details,
    });

    this.alerts.next(this.getAlert());
  }

  openError(
    title: string = 'Errore!',
    text: string = 'Impossibile terminare la procedura.',
    details?: any,
  ): void {
    const currentValue: number = this._lastAlertId++;
    this.addAlert({
      id: currentValue,
      type: 'error',
      text,
      title,
      details,
    });
  }

  openWarning(
    title: string = 'Attenzione!',
    text: string = 'Controllare i dati della procedura.',
    details?: any,
  ): void {
    const currentValue: number = this._lastAlertId++;
    this.addAlert({
      id: currentValue,
      type: 'warning',
      text,
      title,
      details,
    });
  }

  removeArticle(targetId: number): void {
    const alertIndex = this.alerts
      .getValue()
      .findIndex((alert) => alert.id === targetId);

    this.alerts.getValue().splice(alertIndex, 1);
  }
}
