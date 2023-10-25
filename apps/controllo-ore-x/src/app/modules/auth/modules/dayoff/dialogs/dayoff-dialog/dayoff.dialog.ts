import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  DayoffCreateDto,
  DayoffReadDto,
  DayoffUpdateDto,
} from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import { BaseDialog } from '@app/_shared/classes/base-dialog.class';
import { CalendarDateService } from '@app/_shared/components/index-template/servicies/calendar-date.service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { IRtDialogInput, RtDialogService } from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { Subscription } from 'rxjs';
import { DayoffFormHelper } from '../../helpers/dayoff.form-helper';

@Component({
  selector: 'controllo-ore-x-dayoff-dialog',
  templateUrl: './dayoff.dialog.html',
  styleUrls: ['./dayoff.dialog.scss'],
  providers: [DayoffFormHelper],
})
export class DayoffDialog
  extends BaseDialog<DayoffReadDto, DayoffCreateDto, DayoffUpdateDto>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  override title: string = 'Inserimento giustificativo';

  override isCreating: boolean = true;

  subscriptionsList: Subscription[] = [];

  date: Date = new Date();
  allDaySliderStatus: boolean = false;

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: DayoffFormHelper,
    protected override _formBuilder: FormBuilder,
    protected _matDialogRef: MatDialogRef<DayoffDialog>,
    private _rtDialogService: RtDialogService,
    private _alertService: AlertService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
    private _authService: AuthService,
    private _calendarDateService: CalendarDateService,
  ) {
    super(formHelper, _formBuilder, _rtDialogService, _alertService, _router);
  }

  ngOnInit(): void {
    this._setSubscriptions();

    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    this.formHelper.form.patchValue({
      user: this._authService.loggedInUser,
    });

    if (this.data.input) {
      this.formHelper.patchForm(this.data.input);
      this.isCreating = false;
      this.formHelper.entityId = this.data.input._id;
      this.title = 'Modifica giustificativo';
      return;
    }

    this.formHelper.form.patchValue({
      startTime: '00:00',
      endTime: '00:00',
      startDate: this.date,
      endDate: this.date,
    });
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(this._getSelectedDate());
  }

  override onSubmit(): void {
    if (this.allDaySliderStatus) {
      this.formHelper.form.patchValue({
        hours: this._calculateHoursOfDifferentDays(
          this.formHelper.form.value.startDate,
          this.formHelper.form.value.endDate,
        ),
      });
      super.onSubmit();
      return;
    }

    this.formHelper.form.patchValue({
      startDate: this._createDate(
        this.formHelper.form.value.startDate,
        this.formHelper.form.value.startTime,
      ),
      endDate: this._createDate(
        this.formHelper.form.value.endDate,
        this.formHelper.form.value.endTime,
      ),
      hours: this._calculateHoursOfSameDay(
        this.formHelper.form.value.startTime,
        this.formHelper.form.value.endTime,
      ),
    });
    super.onSubmit();
  }

  allDayToggleChange(event: any): void {
    if (event.checked) {
      this.allDaySliderStatus = true;
      this.formHelper.form.controls['startTime'].disable();
      this.formHelper.form.controls['endTime'].disable();
    } else {
      this.allDaySliderStatus = false;
      this.formHelper.form.controls['startTime'].enable();
      this.formHelper.form.controls['endTime'].enable();
    }
  }

  onEndDateChange(event: any): void {
    if (event.value >= this.formHelper.form.value.startDate) {
      this.allDayToggleChange({ checked: true });
    }
  }

  private _getSelectedDate(): Subscription {
    return this._calendarDateService.currentDateObservable.subscribe(
      (selectedDate: Date) => {
        this.date = selectedDate;
      },
    );
  }

  private _createDate(date: Date, hours: string): Date {
    return new Date(date.toDateString() + ' ' + hours);
  }

  private _calculateHoursOfSameDay(startTime: string, endTime: string): number {
    const start = new Date(new Date().toDateString() + ' ' + startTime);
    const end = new Date(new Date().toDateString() + ' ' + endTime);
    const hours = Math.abs(end.getTime() - start.getTime()) / 36e5;
    return hours;
  }

  private _calculateHoursOfDifferentDays(startDay: Date, endDay: Date): number {
    const days = 1 + Math.abs(endDay.getDate() - startDay.getDate());
    const hoursPerDay = 8;
    return hoursPerDay * days;
  }
}
