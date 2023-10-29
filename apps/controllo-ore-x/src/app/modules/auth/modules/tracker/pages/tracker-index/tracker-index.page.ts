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
import { CalendarDateService } from '@app/_shared/components/index-template/services/calendar-date.service';
import { convertNumberToHours } from '@app/utils/NumberToHoursConverter';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RT_DIALOG_CLOSE_RESULT } from '@controllo-ore-x/rt-shared';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TrackerDialog } from '../../dialogs/tracker-dialog/tracker.dialog';

@Component({
  selector: 'controllo-ore-x-tracker-index',
  templateUrl: './tracker-index.page.html',
  styleUrls: ['./tracker-index.page.scss'],
})
export class TrackerIndexPage
  extends IndexPage<UserHoursReadDto, UserHoursCreateDto, UserHoursUpdateDto>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  titleIcon: string | null = 'screen_record';
  title: string = 'Tracker';
  pageTitle = 'Tracker';
  buttonIcon = 'more_time';
  buttonText = 'Inserisci ore';
  workedHours: number = 0;
  selectedDate: Date = new Date();

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.TRACKER;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;
  override isPageWithTable: boolean = false;

  userHours: UserHoursReadDto[] = [];

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  override subscriptionsList: Subscription[] = [];

  override completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: TrackerDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _authService: AuthService,
    private _router: Router,
    private _calendarDateService: CalendarDateService,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.setSubscriptions();
  }

  override ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  override setSubscriptions(): void {
    this.subscriptionsList.push(
      this._calendarDateService.currentDateObservable.subscribe(
        (date: Date) => {
          this.selectedDate = date;
          this.subscriptionsList.push(this._getUserHours());
        },
      ),
    );
  }

  _getUserHours(): Subscription {
    this.isLoading.next(true);
    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    return this._dataService
      .getMany({
        relations: [
          'release',
          'release.project',
          'release.project.customer',
          'hoursTag',
        ],
        where: {
          userId: this._authService.loggedInUser._id,
          date: {
            _fn: FIND_BOOSTED_FN.DATE_BETWEEN,
            args: this._getRangeDate(),
          },
        },
      })
      .subscribe({
        next: (userHours: ApiPaginatedResponse<UserHoursReadDto>) => {
          this.userHours = userHours.data;
          this.workedHours = 0;
          this.userHours.forEach((userHour: UserHoursReadDto) => {
            this.workedHours += Number(userHour.hours);
          });
        },
        error: () => {
          this.hasErrors = true;
        },
        complete: () => {
          this.isLoading.next(false);
        },
      });
  }

  openDialogFn(user: UserHoursReadDto): void {
    this.openDialogEvent.emit(user);
    this._router.navigate([this._router.url + '/' + user._id]);
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }

  createFn(): void {
    const dialogConfig = {
      width: '800px',
      maxWidth: '800px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(TrackerDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.setSubscriptions();
          }
        }),
    );
  }

  onUserHourUpdated(): void {
    this.setSubscriptions();
  }

  private _getRangeDate(): string[] {
    const startDate = new Date(this.selectedDate);
    const endDate = new Date(this.selectedDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);
    return [startDate.toISOString(), endDate.toISOString()];
  }
}
