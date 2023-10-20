import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  CustomerReadDto,
  HoursTagReadDto,
  ProjectReadDto,
  ReleaseReadDto,
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { TrackerDataService } from '@app/_core/services/tracker.data-service';
import { BaseDialog } from '@app/_shared/classes/base-dialog.class';
import { CalendarDateService } from '@app/_shared/components/index-template/servicies/calendar-date.service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { IRtDialogInput, RtDialogService } from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { Subscription } from 'rxjs';
import { TrackerFormHelper } from '../../helpers/tracker.form-helper';

@Component({
  selector: 'controllo-ore-x-tracker-dialog',
  templateUrl: './tracker.dialog.html',
  styleUrls: ['./tracker.dialog.scss'],
  providers: [TrackerFormHelper],
})
export class TrackerDialog
  extends BaseDialog<UserHoursReadDto, UserHoursCreateDto, UserHoursUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  override title: string = 'Inserimento ore';

  override isCreating: boolean = true;

  userHourId?: string | number;

  hoursTags: {
    hoursTag: HoursTagReadDto;
    checked: boolean;
  }[] = [];

  currentCustomer?: CustomerReadDto;
  customers: CustomerReadDto[] = [];

  currentProject?: ProjectReadDto;
  projects: ProjectReadDto[] = [];

  currentRelease?: ReleaseReadDto;
  releases: ReleaseReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: TrackerFormHelper,
    protected override _formBuilder: FormBuilder,
    protected _matDialogRef: MatDialogRef<TrackerDialog>,
    private _trackerDataService: TrackerDataService,
    private _rtDialogService: RtDialogService,
    private _alertService: AlertService,
    private _router: Router,
    private _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
    private _customerDataService: CustomerDataService,
    private _calendarDateService: CalendarDateService,
    private _hoursTagDataService: HoursTagDataService,
    private _projectDataService: ProjectDataService,
    private _releaseDataService: ReleaseDataService,
  ) {
    super(formHelper, _formBuilder, _rtDialogService, _alertService, _router);
  }

  ngOnInit(): void {
    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    this.formHelper.form.patchValue({
      user: this._authService.loggedInUser,
    });

    this._setSubscriptions();

    if (this.data.input) {
      this.formHelper.patchForm(this.data.input);
      if (this.data.input.isDeletion) {
        this.formHelper.entityId = this.data.input._id;
        this.cancel();
        this.deleteEntity();
        return;
      }

      this.formHelper.form.controls['project'].enable();
      this.formHelper.form.controls['release'].enable();
      this.subscriptionsList.push(this._getProjects(), this._getReleases());

      if (this.data.input.isDuplication) {
        this.title = 'Duplica ore';
        return;
      }
      this.isCreating = false;
      this.formHelper.entityId = this.data.input._id;
      this.title = 'Modifica ore';
    }
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._getSelectedDate(),
      this._getHoursTags(),
      this._getCustomers(),
    );
  }

  override onSubmit(): void {
    this.hoursTags.forEach((hoursTag: any) => {
      if (hoursTag.checked) {
        this.formHelper.form.patchValue({
          hoursTag: hoursTag.hoursTag,
        });
        return;
      }
    });
    if (this.data.input && this.data.input.isDuplication) {
      this.isCreating = true;
    }
    super.onSubmit();
  }

  onSelectedCustomer(): void {
    this.formHelper.form.patchValue({
      project: null,
      release: null,
    });
    this.formHelper.form.controls['project'].enable();
    this.formHelper.form.controls['release'].disable();

    this.subscriptionsList.push(this._getProjects());
  }

  onSelectedProject(): void {
    this.formHelper.form.patchValue({
      release: null,
    });
    this.formHelper.form.controls['release'].enable();

    this.subscriptionsList.push(this._getReleases());
  }

  checkHoursTag(tag: any): void {
    this.hoursTags.forEach((hoursTag: any) => {
      if (hoursTag.hoursTag._id == tag.hoursTag._id) {
        hoursTag.checked = true;
      }
    });
  }

  private _getSelectedDate(): Subscription {
    return this._calendarDateService.currentDateObservable.subscribe(
      (selectedDate: Date) => {
        this.formHelper.form.patchValue({
          date: selectedDate,
        });
      },
    );
  }

  /**
   * Fetch and set the userHours' hoursTags from the database.
   */
  private _getHoursTags(): Subscription {
    return this._hoursTagDataService
      .getMany({})
      .subscribe((hoursTag: ApiPaginatedResponse<HoursTagReadDto>) => {
        hoursTag.data.forEach((hoursTag: HoursTagReadDto) => {
          this.hoursTags.push({
            hoursTag: hoursTag,
            checked: false,
          });

          //TODO: chiedere se c'è un modo migliore per fare questo
          if (this.data.input) {
            this.hoursTags.forEach((hoursTag: any) => {
              if (hoursTag.hoursTag._id === this.data.input.hoursTag._id) {
                hoursTag.checked = true;
              }
            });
          }
        });
      });
  }

  /**
   * Fetch and set the userHours' customers from the database.
   */
  private _getCustomers(): Subscription {
    this.formHelper.form.controls['project'].disable();
    this.formHelper.form.controls['release'].disable();
    return this._customerDataService
      .getMany({})
      .subscribe((customers: ApiPaginatedResponse<CustomerReadDto>) => {
        this.customers = customers.data;
        if (this.formHelper.form.value.customer) {
          this.currentCustomer = this.customers.find(
            (customer: CustomerReadDto) =>
              customer._id === this.formHelper.form.value.customer._id,
          );
        }
      });
  }

  /**
   * Fetch and set the userHours' projects from the database.
   */
  private _getProjects(): Subscription {
    return this._projectDataService
      .getMany({
        where: {
          customerId: this.formHelper.form.value.customer._id,
        },
      })
      .subscribe((projects: ApiPaginatedResponse<ProjectReadDto>) => {
        this.projects = projects.data;
        if (this.formHelper.form.value.project) {
          this.currentProject = this.projects.find(
            (project: ProjectReadDto) =>
              project._id === this.formHelper.form.value.project._id,
          );
        }
      });
  }

  /**
   * Fetch and set the userHours' release from the database.
   */
  private _getReleases(): Subscription {
    return this._releaseDataService
      .getMany({
        where: {
          projectId: this.formHelper.form.value.project._id,
        },
        relations: ['project', 'project.customer'],
      })
      .subscribe((releases: ApiPaginatedResponse<ReleaseReadDto>) => {
        this.releases = releases.data;
        if (this.formHelper.form.value.release) {
          this.currentRelease = this.releases.find(
            (release: ReleaseReadDto) =>
              release._id === this.formHelper.form.value.release._id,
          );
        }
      });
  }
}
