import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  COX_FILTER,
  CustomerReadDto,
  FIND_BOOSTED_FN,
  FindBoostedWhereOption,
  HoursTagReadDto,
  INDEX_CONFIGURATION_KEY,
  ProjectReadDto,
  ReleaseReadDto,
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
  UserReadDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ReportDataService } from '@app/_core/services/report.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { endOfDay, startOfDay } from 'date-fns';
import { Subscription } from 'rxjs';
import { CalendarDateService } from '../index-template/servicies/calendar-date.service';
import { FilterService } from './services/filter.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { ReportPage } from '@app/_shared/classes/report-page.class';

/**
 * Template of a report page
 */
@Component({
  selector: 'controllo-ore-x-report-template',
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.scss'],
  providers: [FilterService],
})
export class ReportTemplateComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  onFilterEmit($event: FindBoostedWhereOption[]) {
    throw new Error('Method not implemented.');
  }
  updateFulltextSearch($event: string) {
    throw new Error('Method not implemented.');
  }
  /**
   * Page to be displayed
   */
  @Input() page!: ReportPage<any, any, any>;
  /**
   * If true, the page will have a menu with options
   */
  @Input() hasMenuOptions: boolean = false;

  /**
   * If true, the page will have a calendar
   */
  @Input() hasCalendar: boolean = false;

  /**
   * If true, the page will have a range calendar
   */
  @Input() hasRangeCalendar: boolean = false;

  /**
   * If true, the page will have a button to export the data in csv format
   */
  @Input() hasExportCsv: boolean = true;

  /**
   * The function to be called when the user clicks on the create button
   */
  @Input() createFn?: () => void | Promise<void>;

  /**
   * The function to be called when the user clicks on the edit button
   */
  @Input() editFn?: (entity: any) => void | Promise<void>;

  /**
   * If true, the create button will be hidden
   */
  @Input() shouldHideCreateButton: boolean = false;

  /**
   * If true, the edit button in the table line will be shown
   */
  @Input() isEditAvailable: boolean = false;

  /**
   * The icon of the header button
   */
  @Input() buttonIcon: string = 'Icon';

  /**
   * The text of the header button
   */
  @Input() buttonText: string = 'Button txt';

  data: any[] = [];

  dataForFilters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
    formControl: FormControl;
  }[] = [];

  selectedRangeDate: {
    start: Date;
    end: Date;
  } = {
    start: new Date(),
    end: new Date(),
  };

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  private _isLoading: boolean = true;
  private _isFirstLoadDone: boolean = false;

  constructor(
    private _loadingService: RtLoadingService,
    private _filterService: FilterService,
    private _calendarDateService: CalendarDateService,
  ) {}

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this.page.isLoading.subscribe((isLoading) => {
        this._isLoading = isLoading;
        this._setLoadingParameters();
      }),
      this.page.isFirstLoadDone.subscribe((isFirstLoadDone) => {
        this._isFirstLoadDone = isFirstLoadDone;
        this._setLoadingParameters();
      }),
      this._filterService.dataForFiltersObservable.subscribe(
        (dataForFilters) => {
          this.dataForFilters = dataForFilters;
        },
      ),
    );
  }

  private _setLoadingParameters(): void {
    if (this._isLoading) {
      this._isFirstLoadDone
        ? this._loadingService.showLoading()
        : this._loadingService.showLoadingBlocking();
    } else {
      this._loadingService.hideLoading();
      this._loadingService.hideLoadingBlocking();
    }
  }
}
