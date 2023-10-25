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
import { DayoffDataService } from '@app/_core/services/dayoff.data-service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { CalendarDateService } from '@app/_shared/components/index-template/servicies/calendar-date.service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { endOfDay, startOfDay } from 'date-fns';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-dayoff-index',
  templateUrl: './dayoff-index.page.html',
  styleUrls: ['./dayoff-index.page.scss'],
})
export class DayoffIndexPage
  extends IndexPage<UserHoursReadDto, UserHoursCreateDto, UserHoursUpdateDto>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  titleIcon: string | null = 'carpenter';
  title: string = 'Ferie e permessi';
  pageTitle = 'Ferie e permessi';
  buttonIcon = 'carpenter';
  buttonText = 'Nuovo giustificativo';
  workedHours: number = 0;
  selectedDate: Date = new Date();

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.DAYOFF;
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
    protected _dataService: DayoffDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _authService: AuthService,
    private _router: Router,
    private _calendarDateService: CalendarDateService,
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
    this.subscriptionsList.push(
      this._getUserHours(),
      this._calendarDateService.currentDateObservable.subscribe(
        (date: Date) => {
          this.selectedDate = date;
          this._getUserHours();
        },
      ),
    );
  }

  _getUserHours(): Subscription {
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
            args: [
              startOfDay(this.selectedDate).toISOString(),
              endOfDay(this.selectedDate).toISOString(),
            ],
          },
        },
      })
      .subscribe((userHours: ApiPaginatedResponse<UserHoursReadDto>) => {
        this.userHours = userHours.data;
        this.workedHours = 0;
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

  createFn(): void {
    //   this._rtDialogService
    //     .open(DayoffDialog, {
    //       width: '600px',
    //       maxWidth: '600px',
    //     })
    //     .subscribe();
  }
}
