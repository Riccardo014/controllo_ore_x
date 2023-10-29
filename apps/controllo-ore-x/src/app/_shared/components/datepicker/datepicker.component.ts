import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { CalendarDateService } from '../index-template/services/calendar-date.service';

@Component({
  selector: 'controllo-ore-x-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  date = new FormControl();

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
      this._calendarDateService.currentDateObservable.subscribe((date) =>
        this.date.setValue(date),
      ),
    );
  }

  onDateChange(): void {
    if (!this.date.value) {
      throw new Error('Date is null');
    }
    const date = new Date(this.date.value);
    date.setHours(12);
    this._calendarDateService.changeDate(date);
  }

  nextDay(): void {
    const date = new Date(this.date.value);
    date.setDate(date.getDate() + 1);
    this.date.setValue(date);
    this.onDateChange();
  }

  previousDay(): void {
    const date = new Date(this.date.value);
    date.setDate(date.getDate() - 1);
    this.date.setValue(date);
    this.onDateChange();
  }
}
