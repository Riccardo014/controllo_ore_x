import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RtAlert } from "../components/alert/alert.interface";

@Injectable()
export class AlertService {
  static CURRENT_ALERT_NEXT_ID: number = 0;
  alertArray: RtAlert[] = [];
  alerts: BehaviorSubject<RtAlert[]> = new BehaviorSubject(this.alertArray);

  openSuccess(title: string = 'Ottimo!', text: string = 'Procedura completata con successo.', details?: any): void {
    const currentValue: number = AlertService.CURRENT_ALERT_NEXT_ID++;
    this.alertArray.push({
      id: currentValue,
      type: 'success',
      text,
      title,
      details,
    });

    this.alerts.next(this.alertArray);
  }

  removeValue(id: number): void {
    this.alertArray.splice(this.alertArray.findIndex(alert => alert.id === id), 1);
  }

  openError(title: string = 'Errore!', text: string = 'Impossibile terminare la procedura.', details?: any): void {
    const currentValue: number = AlertService.CURRENT_ALERT_NEXT_ID++;
    this.alertArray.push({
      id: currentValue,
      type: 'error',
      text,
      title,
      details,
    });
  }

  openWarning(title: string = 'Attenzione!', text: string = 'Controllare i dati della procedura.', details?: any): void {
    const currentValue: number = AlertService.CURRENT_ALERT_NEXT_ID++;
    this.alertArray.push({
      id: currentValue,
      type: 'warning',
      text,
      title,
      details,
    });
  }
}
