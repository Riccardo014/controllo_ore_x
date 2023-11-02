import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { completeSubscriptions } from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { CalendarDateService } from '../index-template/services/calendar-date.service';

@Component({
  selector: 'controllo-ore-x-range-datepicker',
  templateUrl: './range-datepicker.component.html',
  styleUrls: ['./range-datepicker.component.scss'],
})
export class RangeDatepickerComponent {
  rangeDates: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
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
          this.rangeDates.controls['start'].setValue(dates.start);
          this.rangeDates.controls['end'].setValue(dates.end);
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

    const startDate = new Date(this.rangeDates.value.start);
    startDate.setHours(12, 0, 0, 0);
    const endDate = new Date(this.rangeDates.value.end);
    endDate.setHours(12, 0, 0, 0);

    this._calendarDateService.changeRangeDates({
      start: startDate,
      end: endDate,
    });
  }
}
