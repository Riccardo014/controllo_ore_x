import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { SubscriptionsLifecycle } from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { FilterService } from './services/filter.service';
import { CalendarDateService } from '../index-template/servicies/calendar-date.service';
import { endOfDay, startOfDay } from 'date-fns';

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
  extends IndexPage<UserHoursReadDto, UserHoursCreateDto, UserHoursUpdateDto>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  titleIcon: string | null = 'chair';
  title: string = 'Report';
  pageTitle = 'Report';
  buttonIcon = 'chair';
  buttonText = '';

  override isCompletePage: boolean = false;
  override isTableTopbarVisible: boolean = false;

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.TRACKER;

  data: any[] = [];

  dataForFilters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
    formControl: FormControl;
  }[] = [];

  selectedDate: Date = new Date();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ReportDataService,
    private _filterService: FilterService,
    private _calendarDateService: CalendarDateService,
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._setSubscriptions();
    this._load();
  }

  override _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._filterService.dataForFiltersObservable.subscribe(
        (dataForFilters) => {
          this.dataForFilters = dataForFilters;
        },
      ),
      this._calendarDateService.currentDateObservable.subscribe(
        (date: Date) => {
          this.selectedDate = date;
          this.changeDataForDate();
        },
      ),
    );
    super._setSubscriptions();
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
            startOfDay(this.selectedDate).toISOString(),
            endOfDay(this.selectedDate).toISOString(),
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
          startOfDay(this.selectedDate).toISOString(),
          endOfDay(this.selectedDate).toISOString(),
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
            this.data = apiResult.data;
            this._setFilters();
            this.changeDataForFilters();
          });
        this.isFirstLoadDone.next(true);
      });
  }

  private _setFilters(): void {
    const customersList: CustomerReadDto[] = [];
    this.data.forEach((data: any) => {
      customersList.findIndex(
        (customer) => customer._id == data.release.project.customer._id,
      ) == -1 && customersList.push(data.release.project.customer);
    });
    this._insertNewFilter(
      'Cliente',
      'Clienti',
      COX_FILTER.CUSTOMER,
      customersList,
    );

    const projectsList: ProjectReadDto[] = [];
    this.data.forEach((data: any) => {
      projectsList.findIndex(
        (project) => project._id == data.release.project._id,
      ) == -1 && projectsList.push(data.release.project);
    });
    this._insertNewFilter(
      'Progetto',
      'Progetti',
      COX_FILTER.PROJECT,
      projectsList,
    );

    const releaseList: ReleaseReadDto[] = [];
    this.data.forEach((data: any) => {
      releaseList.findIndex((release) => release._id == data.release._id) ==
        -1 && releaseList.push(data.release);
    });
    this._insertNewFilter(
      'Release',
      'Release',
      COX_FILTER.RELEASE,
      releaseList,
    );

    const teamList: UserReadDto[] = [];
    this.data.forEach((data: any) => {
      teamList.findIndex((user) => user._id == data.user._id) == -1 &&
        teamList.push(data.user);
    });
    this._insertNewFilter('Membro', 'Membri', COX_FILTER.TEAM, teamList);

    const hoursTagList: HoursTagReadDto[] = [];
    this.data.forEach((data: any) => {
      hoursTagList.findIndex((hoursTag) => hoursTag._id == data.hoursTag._id) ==
        -1 && hoursTagList.push(data.hoursTag);
    });
    this._insertNewFilter(
      'Etichetta',
      'Etichette',
      COX_FILTER.TAG,
      hoursTagList,
    );
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
}
