import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarDateService {
  currentDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  currentRangeDates: BehaviorSubject<{
    start: Date;
    end: Date;
  }> = new BehaviorSubject<{
    start: Date;
    end: Date;
  }>({
    start: new Date(),
    end: new Date(),
  });

  currentDateObservable: Observable<Date> = this.currentDate.asObservable();

  currentRangeDatesObservable: Observable<{
    start: Date;
    end: Date;
  }> = this.currentRangeDates.asObservable();

  changeDate(date: Date): void {
    this.currentDate.next(date);
  }

  changeRangeDates(dates: { start: Date; end: Date }): void {
    this.currentRangeDates.next(dates);
  }
}
