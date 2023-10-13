import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { Subscription } from 'rxjs';
import { TrackerDataService } from '@app/_core/services/tracker.data-service';
import { TrackerFormHelper } from '../../helpers/tracker.form-helper';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { CalendarDateService } from '@app/_shared/components/index-template/servicies/calendar-date.service';
import { AuthService } from '@app/_core/services/auth.service';

@Component({
  selector: 'controllo-ore-x-tracker-upsert',
  templateUrl: './tracker-upsert.page.html',
  styleUrls: ['./tracker-upsert.page.scss'],
  providers: [TrackerFormHelper],
})
export class TrackerUpsertPage
  extends UpsertPage<UserHoursReadDto, UserHoursCreateDto, UserHoursUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit {
  override title: string = 'Inserimento ore';

  userHourId?: string | number;

  hoursTags: HoursTagReadDto[] = [];

  currentCustomer?: string;
  customers: CustomerReadDto[] = [];

  currentProject?: string;
  projects: ProjectReadDto[] = [];

  currentRelease?: string;
  releases: ReleaseReadDto[] = [];

  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: TrackerFormHelper,
    private _trackerDataService: TrackerDataService,
    private _alertService: AlertService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _calendarDateService: CalendarDateService,
    private _hoursTagDataService: HoursTagDataService,
    private _customerDataService: CustomerDataService,
    private _projectDataService: ProjectDataService,
    private _releaseDataService: ReleaseDataService,
  ) {
    super(
      formHelper,
      _alertService,
      _rtDialogService,
      _router,
      _activatedRoute,
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    this.formHelper.form.patchValue({
      user: this._authService.loggedInUser._id,
    });

    this._setSubscriptions();

    if (!this.isCreating) {
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
    if (!this.isCreating) {
        //TODO
      this.userHourId = this.formHelper.entityId;
      this.subscriptionsList.push(this._getUserHours());
    }
  }

  //TODO
  override handleUserSubmission(): void {
    // this.formHelper.form.patchValue({
    //   customer: this.formHelper.form.value.customer._id,
    //   project: this.formHelper.form.value.project._id,
    //   release: this.formHelper.form.value.release._id,
    //   hoursTag: this.formHelper.form.value.hoursTag._id,
    // });

    super.handleUserSubmission();
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

  private _getSelectedDate(): Subscription {
    return this._calendarDateService.currentDateObservable
      .subscribe((selectedDate: Date) => {
        this.formHelper.form.patchValue({
          date: selectedDate,
        });
      }
    );
  }

  /**
   * Get the user hours' data from the database.
   */
  //TODO
  private _getUserHours(): Subscription {
    if (!this.userHourId) {
      throw new Error('Non è stato possibile recuperare i dati delle ore dell\'utente');
    }
    return this._trackerDataService.getOne(this.userHourId).subscribe((userHour: any) => {
      console.log(userHour);
      this.formHelper.patchForm(userHour);
      this.currentRelease = userHour.release.version;
    });
  }

  /**
   * Fetch and set the userHours' hoursTags from the database.
   */
  private _getHoursTags(): Subscription {
    return this._hoursTagDataService
      .getMany({})
      .subscribe((hoursTag: ApiPaginatedResponse<HoursTagReadDto>) => {
        this.hoursTags = hoursTag.data;
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
      })
      .subscribe((releases: ApiPaginatedResponse<ReleaseReadDto>) => {
        this.releases = releases.data;
      });
  }
}
