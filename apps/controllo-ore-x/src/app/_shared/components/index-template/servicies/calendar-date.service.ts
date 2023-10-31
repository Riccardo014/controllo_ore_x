import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarDateService {
  currentDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  currentDateObservable: Observable<Date> = this.currentDate.asObservable();

  changeDate(date: Date): void {
    this.currentDate.next(date);
  }
}
