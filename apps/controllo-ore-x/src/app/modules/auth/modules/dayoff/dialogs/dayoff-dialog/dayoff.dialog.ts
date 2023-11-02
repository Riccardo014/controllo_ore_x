import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DayoffReadDto, DayoffUpdateDto } from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import { DayoffDataService } from '@app/_core/services/dayoff.data-service';
import { CalendarDateService } from '@app/_shared/components/index-template/services/calendar-date.service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  IRtDialogClose,
  IRtDialogInput,
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-dayoff-dialog',
  templateUrl: './dayoff.dialog.html',
  styleUrls: ['./dayoff.dialog.scss'],
})
export class DayoffDialog implements OnInit, OnDestroy, SubscriptionsLifecycle {
  title: string = 'Inserimento giustificativo';
  transactionStatus: 'create' | 'update' = 'create';
  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = '';

  dayoff?: DayoffReadDto;

  dayoffFormGroup: FormGroup = new FormGroup({
    user: new FormControl(null, Validators.required),
    hoursTag: new FormControl(null, Validators.required),
    startDate: new FormControl(null, Validators.required),
    endDate: new FormControl(null, Validators.required),
    startTime: new FormControl(null, Validators.required),
    endTime: new FormControl(null, Validators.required),
    hours: new FormControl(null, Validators.required),
    notes: new FormControl(null, Validators.required),
  });

  date: Date = new Date();
  isAllDaySliderChecked: boolean = false;
  isAllDaySliderDisabled: boolean = false;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _dayoffDataService: DayoffDataService,
    public dialogRef: MatDialogRef<DayoffDialog>,
    private _alertService: AlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: IRtDialogInput<DayoffReadDto>,
    private _rtDialogService: RtDialogService,

    private _authService: AuthService,
    private _calendarDateService: CalendarDateService,
  ) {
    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    this.dayoffFormGroup.patchValue({
      user: this._authService.loggedInUser,
    });

    if (this.data.input) {
      this.dayoff = this.data.input;
      this._patchForm(this.data.input);
      this.transactionStatus = 'update';
      this.title = 'Modifica giustificativo';
      this._compareDate(
        this._createDate(
          this.dayoffFormGroup.value.startDate,
          this.dayoffFormGroup.value.startTime,
        ),
        this._createDate(
          this.dayoffFormGroup.value.endDate,
          this.dayoffFormGroup.value.endTime,
        ),
      );
      return;
    }
    this.dayoffFormGroup.patchValue({
      startTime: '00:00',
      endTime: '00:00',
      startDate: this.date,
      endDate: this.date,
    });
  }

  get updateDto(): DayoffUpdateDto {
    const formValues: any = this.dayoffFormGroup.getRawValue();

    return {
      userId: formValues.user._id,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      notes: formValues.notes,
      hours: formValues.hours,
    };
  }

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._getSelectedDate());
  }

  onDelete(): void {
    this._rtDialogService
      .openConfirmation(
        "Procedere con l'eliminazione?",
        "L'operazione non è reversibile",
      )
      .subscribe({
        next: (res) => {
          if (res?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this._delete();
          }
        },
      });
  }

  onCancel(): void {
    const modalRes: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CANCEL,
    };
    this.dialogRef.close(modalRes);
  }

  onSubmit(): void {
    this.hasErrors = false;

    this._initForm();

    if (this.transactionStatus === 'update') {
      this._update();
      return;
    }

    this._create();
  }

  onReFetch(): void {
    window.location.reload();
  }

  getFormControlError(field: string, error: Error): boolean {
    return this.dayoffFormGroup.controls[field].hasError(error.name);
  }

  allDayToggleChange(event: any): void {
    if (event.checked) {
      this.isAllDaySliderChecked = true;
      this.dayoffFormGroup.controls['startTime'].disable();
      this.dayoffFormGroup.controls['endTime'].disable();
      this.dayoffFormGroup.patchValue({
        startTime: '00:00',
        endTime: '00:00',
      });
    } else {
      this.isAllDaySliderChecked = false;
      this.dayoffFormGroup.controls['startTime'].enable();
      this.dayoffFormGroup.controls['endTime'].enable();
    }
  }

  onEndDateChange(date: Date): void {
    this._compareDate(this.dayoffFormGroup.value.startDate, date);
  }

  onStartDateChange(date: Date): void {
    this._compareDate(date, this.dayoffFormGroup.value.endDate);
  }

  private _compareDate(startDate: Date, endDate: Date): void {
    if (startDate.valueOf() === endDate.valueOf()) {
      this.isAllDaySliderDisabled = true;
      this.allDayToggleChange({ checked: true });
    }
    if (new Date(endDate.toDateString()) > new Date(startDate.toDateString())) {
      this.isAllDaySliderDisabled = true;
      this.allDayToggleChange({ checked: true });
    } else {
      this.isAllDaySliderDisabled = false;
    }
  }

  private _getSelectedDate(): Subscription {
    return this._calendarDateService.currentDateObservable.subscribe({
      next: (selectedDate: Date) => {
        this.date = new Date(selectedDate);
        this.date.setHours(0, 0, 0, 0);
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
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
    startDay.setHours(12, 0, 0, 0);
    endDay.setHours(12, 0, 0, 0);
    const days =
      1 + (endDay.getTime() - startDay.getTime()) / (1000 * 3600 * 24);
    const hoursPerDay = 8;
    return hoursPerDay * days;
  }

  private _initForm(): void {
    if (
      this.dayoffFormGroup.get('startTime')?.value === '00:00' &&
      this.dayoffFormGroup.get('endTime')?.value === '00:00'
    ) {
      this.isAllDaySliderChecked = true;
    }
    if (this.isAllDaySliderChecked) {
      this.dayoffFormGroup.patchValue({
        startTime: '00:00',
        endTime: '00:00',
      });
      this.dayoffFormGroup.patchValue({
        startDate: this._createDate(
          this.dayoffFormGroup.value.startDate,
          '00:00',
        ),
        endDate: this._createDate(this.dayoffFormGroup.value.endDate, '00:00'),
        hours: this._calculateHoursOfDifferentDays(
          this.dayoffFormGroup.value.startDate,
          this.dayoffFormGroup.value.endDate,
        ),
      });
      return;
    }

    this.dayoffFormGroup.patchValue({
      startDate: this._createDate(
        this.dayoffFormGroup.value.startDate,
        this.dayoffFormGroup.value.startTime,
      ),
      endDate: this._createDate(
        this.dayoffFormGroup.value.endDate,
        this.dayoffFormGroup.value.endTime,
      ),
      hours: this._calculateHoursOfSameDay(
        this.dayoffFormGroup.value.startTime,
        this.dayoffFormGroup.value.endTime,
      ),
    });
  }

  private _patchForm(value: DayoffReadDto): void {
    this.dayoffFormGroup.patchValue({
      user: value.user,
      hoursTag: value.hoursTag,
      startDate: new Date(new Date(value.startDate).setHours(0, 0, 0, 0)),
      endDate: new Date(new Date(value.endDate).setHours(0, 0, 0, 0)),
      startTime: this._timeFromDate(value.startDate),
      endTime: this._timeFromDate(value.endDate),
      hours: value.hours,
      notes: value.notes,
    });
  }

  private _timeFromDate(date: Date): string {
    const formattedDate = new Intl.DateTimeFormat(navigator.language, {
      timeStyle: 'short',
    }).format(new Date(date));
    return formattedDate;
  }

  private _create(): void {
    const dayoffDto: DayoffReadDto = this.dayoffFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._dayoffDataService.create(dayoffDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = 'Non è stato possibile creare il giustificativo';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _update(): void {
    if (!this.dayoff || this.transactionStatus === 'create') {
      return;
    }

    const dayoffId: string = this.dayoff._id;
    const dayoffDto: DayoffUpdateDto = this.updateDto;

    this.isLoading = true;
    this.hasErrors = false;
    this._dayoffDataService.update(dayoffId, dayoffDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage =
          'Non è stato possibile aggiornare i dati del giustificativo';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _delete(): void {
    if (!this.dayoff) {
      return;
    }

    const dayoffId: string = this.dayoff._id;

    this.isLoading = true;
    this.hasErrors = false;
    this._dayoffDataService.delete(dayoffId).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = 'Non è stato possibile eliminare il giustificativo';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
