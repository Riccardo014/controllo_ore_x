import { Directive, OnDestroy, OnInit } from '@angular/core';
import {
  COX_FILTER,
  CustomerReadDto,
  FIND_BOOSTED_FN,
  FindBoostedWhereOption,
  INDEX_CONFIGURATION_KEY,
  ProjectReadDto,
  ReleaseReadDto,
  TableConfiguration,
  UserReadDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  BaseDataService,
  RtTableApiStatusManager,
} from '@controllo-ore-x/rt-shared';
import { endOfDay, startOfDay } from 'date-fns';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FilterService } from '../components/report-template/services/filter.service';
import { FormControl } from '@angular/forms';
import { CalendarDateService } from '../components/index-template/servicies/calendar-date.service';

/**
 * It's a helper class to manage the index pages
 */
@Directive()
export abstract class ReportPage<T, CreateT, UpdateT>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  subscriptionsList: Subscription[] = [];
  isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  isTableTopbarVisible: boolean = true;
  isTableHeaderVisible: boolean = true;
  isCompletePage: boolean = true;

  configuration!: TableConfiguration;
  indexTableHandler!: RtTableApiStatusManager<T, CreateT, UpdateT>;

  abstract title: string;
  dataForFilters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
    formControl: FormControl;
  }[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  abstract CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY;
  protected abstract _dataService: BaseDataService<T, CreateT, UpdateT>;
  protected abstract _configurationService: IndexConfigurationDataService;
  protected abstract _filterService: FilterService;
  protected abstract _calendarDateService: CalendarDateService;
  selectedRangeDate: any;

  ngOnInit(): void {
    this.indexTableHandler = new RtTableApiStatusManager<T, CreateT, UpdateT>(
      this._dataService,
    );
    if (!this.indexTableHandler) {
      throw new Error('Ititialization of indexTableHandler failed');
    }

    this._setSubscriptions();

    this._load();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._firstLoad(),
      this.indexTableHandler.isLoading.subscribe((r) => {
        this.isFirstLoadDone.next(true);
        this.isLoading.next(r);
      }),
      this._calendarDateService.currentRangeDatesObservable.subscribe(
        (dates: { start: Date; end: Date }) => {
          this.selectedRangeDate = dates;
          this.changeDataForDate();
        },
      ),
    );
  }

  changeDataForDate(): void {
    if (
      !this.indexTableHandler.status ||
      !this.indexTableHandler.tableConfiguration
    ) {
      return;
    }
    if (
      !this.indexTableHandler.status.where &&
      this.indexTableHandler.tableConfiguration
    ) {
      const newWhereOption: FindBoostedWhereOption = {
        date: {
          _fn: FIND_BOOSTED_FN.DATE_BETWEEN,
          args: [
            startOfDay(this.selectedRangeDate.start).toISOString(),
            endOfDay(this.selectedRangeDate.end).toISOString(),
          ],
        },
      };
      this.indexTableHandler.status.where = [newWhereOption];
      this.indexTableHandler.statusChange(this.indexTableHandler.status);
      return;
    }
    const previousWhereOption = this.indexTableHandler.status.where[0];

    const newWhereOption: FindBoostedWhereOption = {
      ...previousWhereOption,
      date: {
        _fn: FIND_BOOSTED_FN.DATE_BETWEEN,
        args: [
          startOfDay(this.selectedRangeDate.start).toISOString(),
          endOfDay(this.selectedRangeDate.end).toISOString(),
        ],
      },
    };

    this.indexTableHandler.status.where = [newWhereOption];
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }

  changeDataForFilters(): void {
    this._filterService.changeDataForFilters(this.dataForFilters);
  }

  updateFulltextSearch(fulltextSearch: string): void {
    this.indexTableHandler.status.fulltextSearch = fulltextSearch;
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }

  onFilterEmit(filters: FindBoostedWhereOption[]): void {
    this.indexTableHandler.status.where = filters;
    this.changeDataForDate();
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }

  private _load(): Subscription {
    return this._configurationService
      .getConfiguration(this.CONFIGURATION_KEY)
      .subscribe((data) => {
        this.configuration = data.configuration;
        this.indexTableHandler.tableConfiguration = this.configuration;
        this.changeDataForDate();
        this._dataService
          .getMany({
            relations: this.indexTableHandler.tableConfiguration.relations,
          })
          .subscribe((apiResult) => {
            this.indexTableHandler.data = apiResult.data;
            this._setFilters();
            this.changeDataForFilters();
          });
        this.isFirstLoadDone.next(true);
      });
  }

  private _setFilters(): void {
    // const customersList: CustomerReadDto[] = [];
    // this.data.forEach((data: any) => {
    //   customersList.findIndex(
    //     (customer) => customer._id == data.release.project.customer._id,
    //   ) == -1 && customersList.push(data.release.project.customer);
    // });
    // this._insertNewFilter(
    //   'Cliente',
    //   'Clienti',
    //   COX_FILTER.CUSTOMER,
    //   customersList,
    // );

    // const projectsList: ProjectReadDto[] = [];
    // this.data.forEach((data: any) => {
    //   projectsList.findIndex(
    //     (project) => project._id == data.release.project._id,
    //   ) == -1 && projectsList.push(data.release.project);
    // });
    // this._insertNewFilter(
    //   'Progetto',
    //   'Progetti',
    //   COX_FILTER.PROJECT,
    //   projectsList,
    // );

    // const releaseList: ReleaseReadDto[] = [];
    // this.data.forEach((data: any) => {
    //   releaseList.findIndex((release) => release._id == data.release._id) ==
    //     -1 && releaseList.push(data.release);
    // });
    // this._insertNewFilter(
    //   'Release',
    //   'Release',
    //   COX_FILTER.RELEASE,
    //   releaseList,
    // );

    // const teamList: UserReadDto[] = [];
    // this.data.forEach((data: any) => {
    //   teamList.findIndex((user) => user._id == data.user._id) == -1 &&
    //     teamList.push(data.user);
    // });
    // this._insertNewFilter('Membro', 'Membri', COX_FILTER.TEAM, teamList);

    // const hoursTagList: HoursTagReadDto[] = [];
    // this.data.forEach((data: any) => {
    //   hoursTagList.findIndex((hoursTag) => hoursTag._id == data.hoursTag._id) ==
    //     -1 && hoursTagList.push(data.hoursTag);
    // });
    // this._insertNewFilter(
    //   'Etichetta',
    //   'Etichette',
    //   COX_FILTER.TAG,
    //   hoursTagList,
    // );
  }

  private _insertNewFilter(
    singleLabel: string,
    multiLabel: string,
    fieldName: COX_FILTER,
    list: any[],
  ): void {
    this.dataForFilters.push({
      list: list,
      singleLabel: singleLabel,
      multiLabel: multiLabel,
      fieldName: fieldName,
      formControl: new FormControl(),
    });
  }

  private _firstLoad(): Subscription {
    return this._configurationService
      .getConfiguration(this.CONFIGURATION_KEY)
      .subscribe((data) => {
        this.configuration = data.configuration;
        this.indexTableHandler.tableConfiguration = this.configuration;
        this.indexTableHandler.fetchData();
        this.isFirstLoadDone.next(true);
      });
  }
}
