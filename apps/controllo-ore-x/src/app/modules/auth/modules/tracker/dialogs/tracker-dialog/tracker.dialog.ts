import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ApiPaginatedResponse,
  CustomerReadDto,
  HoursTagReadDto,
  ProjectReadDto,
  ReleaseReadDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { TrackerDataService } from '@app/_core/services/tracker.data-service';
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
  selector: 'controllo-ore-x-tracker-dialog',
  templateUrl: './tracker.dialog.html',
  styleUrls: ['./tracker.dialog.scss'],
})
export class TrackerDialog
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  title: string = 'Inserimento ore';
  transactionStatus: 'create' | 'update' | 'duplicate' = 'create';
  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = '';

  userHour?: UserHoursReadDto;

  hoursTags: {
    hoursTag: HoursTagReadDto;
    checked: boolean;
  }[] = [];

  customers: CustomerReadDto[] = [];

  projects: ProjectReadDto[] = [];

  releases: ReleaseReadDto[] = [];

  trackerFormGroup: FormGroup = new FormGroup({
    user: new FormControl(null, Validators.required),
    customer: new FormControl(null, Validators.required),
    project: new FormControl(null, Validators.required),
    release: new FormControl(null, Validators.required),
    hoursTag: new FormControl(null, Validators.required),
    date: new FormControl(null, Validators.required),
    notes: new FormControl(null, Validators.required),
    hours: new FormControl(null, Validators.required),
  });

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _trackerDataService: TrackerDataService,
    public dialogRef: MatDialogRef<TrackerDialog>,
    private _alertService: AlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: IRtDialogInput<any>,
    private _rtDialogService: RtDialogService,

    private _authService: AuthService,
    private _calendarDateService: CalendarDateService,
    private _customerDataService: CustomerDataService,
    private _projectDataService: ProjectDataService,
    private _hoursTagDataService: HoursTagDataService,
    private _releaseDataService: ReleaseDataService,
  ) {
    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    this.trackerFormGroup.patchValue({
      user: this._authService.loggedInUser,
    });

    if (this.data.input) {
      this.userHour = this.data.input.userHour;
      this._patchForm(this.data.input.userHour);

      if (this.data.input.transactionStatus === 'duplicate') {
        this.transactionStatus = 'duplicate';
        this.title = 'Duplica ore';
        return;
      }

      this.transactionStatus = 'update';
      this.title = 'Modifica ore';
    }
  }

  get updateDto(): UserHoursUpdateDto {
    const formValues: any = this.trackerFormGroup.getRawValue();

    return {
      userId: formValues.user._id,
      releaseId: formValues.release._id,
      hoursTagId: formValues.hoursTag._id,
      date: formValues.date,
      notes: formValues.notes,
      hours: formValues.hours,
    };
  }

  ngOnInit(): void {
    this.setSubscriptions();

    if (
      this.transactionStatus === 'update' ||
      this.transactionStatus === 'duplicate'
    ) {
      this.trackerFormGroup.controls['project'].enable();
      this.trackerFormGroup.controls['release'].enable();
      this.subscriptionsList.push(this._getProjects(), this._getReleases());
    }
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this._getSelectedDate(),
      this._getHoursTags(),
      this._getCustomers(),
    );
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

    this._patchHoursTag();

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
    return this.trackerFormGroup.controls[field].hasError(error.name);
  }

  compareEntityFn(x: any, y: any): boolean {
    return x?._id === y?._id;
  }

  onSelectedCustomer(): void {
    this.trackerFormGroup.patchValue({
      project: null,
      release: null,
    });
    this.trackerFormGroup.controls['project'].enable();
    this.trackerFormGroup.controls['release'].disable();

    this.subscriptionsList.push(this._getProjects());
  }

  onSelectedProject(): void {
    this.trackerFormGroup.patchValue({
      release: null,
    });
    this.trackerFormGroup.controls['release'].enable();
    this.subscriptionsList.push(this._getReleases());
  }

  checkHoursTag(tag: any): void {
    for (const hoursTag of this.hoursTags) {
      hoursTag.checked = false;
      if (hoursTag.hoursTag._id == tag.hoursTag._id) {
        hoursTag.checked = true;
      }
    }
  }

  private _create(): void {
    const userHourDto: UserHoursReadDto = this.trackerFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._trackerDataService.create(userHourDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = "Non è stato possibile creare l'attività";
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _update(): void {
    if (!this.userHour || this.transactionStatus === 'create') {
      return;
    }

    const userHourId: string = this.userHour._id;
    const userHourDto: UserHoursUpdateDto = this.updateDto;

    this.isLoading = true;
    this.hasErrors = false;
    this._trackerDataService.update(userHourId, userHourDto).subscribe({
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
          "Non è stato possibile aggiornare i dati dell'attività";
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _delete(): void {
    if (!this.userHour) {
      return;
    }

    const userHourId: string = this.userHour._id;

    this.isLoading = true;
    this.hasErrors = false;
    this._trackerDataService.delete(userHourId).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.DELETE,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this._alertService.openError();
        this.errorMessage = "Non è stato possibile eliminare l'attività";
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Fetch and set the userHours' customers from the database.
   */
  private _getCustomers(): Subscription {
    this.trackerFormGroup.controls['project'].disable();
    this.trackerFormGroup.controls['release'].disable();
    return this._customerDataService.getMany({}).subscribe({
      next: (customers: ApiPaginatedResponse<CustomerReadDto>) => {
        this.customers = customers.data;
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  /**
   * Fetch and set the userHours' projects from the database.
   */
  private _getProjects(): Subscription {
    return this._projectDataService
      .getMany({
        where: {
          customerId: this.trackerFormGroup.value.customer._id,
        },
      })
      .subscribe({
        next: (projects: ApiPaginatedResponse<ProjectReadDto>) => {
          this.projects = projects.data;
        },
        error: (error: any) => {
          throw new Error(error);
        },
      });
  }

  /**
   * Fetch and set the userHours' release from the database.
   */
  private _getReleases(): Subscription {
    return this._releaseDataService
      .getMany({
        where: {
          projectId: this.trackerFormGroup.value.project._id,
        },
        // relations: ['project', 'project.customer'],
      })
      .subscribe({
        next: (releases: ApiPaginatedResponse<ReleaseReadDto>) => {
          this.releases = releases.data;
        },
        error: (error: any) => {
          throw new Error(error);
        },
      });
  }

  private _getSelectedDate(): Subscription {
    return this._calendarDateService.currentDateObservable.subscribe({
      next: (selectedDate: Date) => {
        this.trackerFormGroup.patchValue({
          date: selectedDate,
        });
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  /**
   * Fetch and set the userHours' hoursTags from the database.
   */
  private _getHoursTags(): Subscription {
    return this._hoursTagDataService.getMany({}).subscribe({
      next: (hoursTags: ApiPaginatedResponse<HoursTagReadDto>) => {
        for (const hoursTag of hoursTags.data) {
          this.hoursTags.push({
            hoursTag: hoursTag,
            checked: false,
          });
        }
        if (this.transactionStatus === 'create') {
          this.hoursTags[0].checked = true;
          this.trackerFormGroup.patchValue({
            hoursTag: this.hoursTags[0].hoursTag,
          });
        }
        if (
          this.transactionStatus === 'update' ||
          this.transactionStatus === 'duplicate'
        ) {
          this.checkHoursTag(this.userHour);
        }
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  private _patchHoursTag(): void {
    for (const hoursTag of this.hoursTags) {
      if (hoursTag.checked) {
        this.trackerFormGroup.patchValue({
          hoursTag: hoursTag.hoursTag,
        });
        return;
      }
    }
  }

  private _patchForm(userHour: UserHoursReadDto): void {
    this.trackerFormGroup.patchValue({
      customer: userHour.release!.project!.customer,
      project: userHour.release!.project,
      release: userHour.release,
      hoursTag: userHour.hoursTag,
      date: userHour.date,
      notes: userHour.notes,
      hours: userHour.hours,
    });
  }
}
