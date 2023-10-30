import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DayoffCreateDto,
  DayoffReadDto,
  DayoffUpdateDto,
  FindBoostedWhereOption,
  INDEX_CONFIGURATION_KEY,
} from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import { DayoffDataService } from '@app/_core/services/dayoff.data-service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DayoffDialog } from '../../dialogs/dayoff-dialog/dayoff.dialog';

@Component({
  selector: 'controllo-ore-x-dayoff-index',
  templateUrl: './dayoff-index.page.html',
  styleUrls: ['./dayoff-index.page.scss'],
})
export class DayoffIndexPage
  extends IndexPage<DayoffReadDto, DayoffCreateDto, DayoffUpdateDto>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  titleIcon: string | null = 'carpenter';
  title: string = 'Ferie e permessi';
  pageTitle = 'Ferie e permessi';
  buttonIcon = 'carpenter';
  buttonText = 'Nuovo giustificativo';
  dayoffsHours: number = 0;
  selectedDate: Date = new Date();

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.DAYOFF;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  override isTableTopbarVisible: boolean = false;

  dayoffs: DayoffReadDto[] = [];

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
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._setSubscriptions();
    this.indexTableHandler.isLoading.subscribe((r) => {
      this._setDayoffsHours();
      this.isFirstLoadDone.next(true);
      this.isLoading.next(r);
    });
  }

  override _firstLoad(): Subscription {
    return this._configurationService
      .getConfiguration(this.CONFIGURATION_KEY)
      .subscribe((data) => {
        this.configuration = data.configuration;
        this.indexTableHandler.tableConfiguration = this.configuration;
        this._setTableStatus();
        this.indexTableHandler.fetchData();
        this.isFirstLoadDone.next(true);
      });
  }

  openDialogFn($event: DayoffReadDto): void {
    this._rtDialogService
      .open(DayoffDialog, {
        width: '600px',
        maxWidth: '600px',
        data: $event,
      })
      .subscribe();
  }

  convertNumberToHours(number: number): string {
    const hours = Math.floor(number);
    const minutes = Math.round((number - hours) * 60).toString();
    return hours.toString().padStart(2, '0') + ':' + minutes.padStart(2, '0');
  }

  createFn(): void {
    this._rtDialogService
      .open(DayoffDialog, {
        width: '600px',
        maxWidth: '600px',
      })
      .subscribe();
  }

  updateFulltextSearch(fulltextSearch: string): void {
    this.indexTableHandler.status.fulltextSearch = fulltextSearch;
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }

  private _setDayoffsHours(): void {
    this.dayoffsHours = 0;
    this.indexTableHandler.data.forEach((dayoff: DayoffReadDto) => {
      this.dayoffsHours += Number(dayoff.hours);
    });
  }

  private _setTableStatus(): void {
    if (!this._authService.loggedInUser) {
      throw new Error('User not logged in');
    }
    const newWhereOption: FindBoostedWhereOption = {
      userId: this._authService.loggedInUser._id,
    };
    this.indexTableHandler.status.where = [newWhereOption];
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }
}
