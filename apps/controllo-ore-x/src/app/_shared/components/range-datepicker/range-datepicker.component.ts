import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { completeSubscriptions } from '@app/utils/subscriptions_lifecycle';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { CalendarDateService } from '../index-template/servicies/calendar-date.service';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YY',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'controllo-ore-x-range-datepicker',
  templateUrl: './range-datepicker.component.html',
  styleUrls: ['./range-datepicker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RangeDatepickerComponent {
  rangeDates: FormGroup = new FormGroup({
    start: new FormControl(moment()),
    end: new FormControl(moment()),
  });

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _calendarDateService: CalendarDateService) {}

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this._calendarDateService.currentRangeDatesObservable.subscribe(
        (dates) => {
          this.rangeDates.controls['start'].setValue(moment(dates.start));
          this.rangeDates.controls['end'].setValue(moment(dates.end));
        },
      ),
    );
  }

  dateRangeChange(): void {
    if (
      !this.rangeDates.value ||
      !this.rangeDates.value.start ||
      !this.rangeDates.value.end
    ) {
      return;
    }
    this._calendarDateService.changeRangeDates({
      start: this.rangeDates.value.start.toDate(),
      end: this.rangeDates.value.end.toDate(),
    });
  }
}
