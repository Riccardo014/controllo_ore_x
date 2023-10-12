import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  FIND_BOOSTED_FN,
  INDEX_CONFIGURATION_KEY,
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { TrackerDataService } from '@app/_core/services/tracker.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { endOfDay, startOfDay } from 'date-fns';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Between } from 'typeorm';

@Component({
  selector: 'controllo-ore-x-tracker-index',
  templateUrl: './tracker-index.page.html',
  styleUrls: ['./tracker-index.page.scss'],
})
export class TrackerIndexPage
  extends IndexPage<UserHoursReadDto, UserHoursCreateDto, UserHoursUpdateDto>
  implements OnInit, OnDestroy, SubscriptionsLifecycle {
  titleIcon: string | null = 'screen_record';
  title: string = 'Tracker';
  pageTitle = 'Tracker';
  buttonIcon = 'more_time';
  buttonText = 'Inserisci ore';
  workedHours: number = 0;

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.TRACKER;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;
  override isPageWithTable: boolean = false;

  userHours: UserHoursReadDto[] = [];

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  override subscriptionsList: Subscription[] = [];

  override _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: TrackerDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _authService: AuthService,
    private _router: Router,
  ) {
    super();
  }

  override ngOnInit(): void {
    this._setSubscriptions();
  }

  override ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  override _setSubscriptions(): void {
    this.subscriptionsList.push(this._getUserHours());
  }

  _getUserHours(): Subscription {
    const todayDate: Date = new Date();
    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    return this._dataService
      .getMany({
        relations: ['release', 'release.project', 'hoursTag'],
        logging: true,
        where: {
          userId: this._authService.loggedInUser._id,
          date: {
            _fn: FIND_BOOSTED_FN.DATE_BETWEEN,
            args: [startOfDay(todayDate).toISOString(), endOfDay(todayDate).toISOString()],
          },
        },
      })
      .subscribe((userHours: ApiPaginatedResponse<UserHoursReadDto>) => {
        this.userHours = userHours.data;
        this.userHours.forEach((userHour: UserHoursReadDto) => {
          this.workedHours += Number(userHour.hours);
        });
      });
  }

  openDialogFn($event: UserHoursReadDto): void {
    this.openDialog.emit($event);
    this._router.navigate([this._router.url + '/' + $event._id]);
  }

  convertNumberToHours(number: number): string {
    const hours = Math.floor(number);
    const minutes = Math.round((number - hours) * 60).toString();
    return hours.toString().padStart(2, '0') + ':' + minutes.padStart(2, '0');
  }

}
