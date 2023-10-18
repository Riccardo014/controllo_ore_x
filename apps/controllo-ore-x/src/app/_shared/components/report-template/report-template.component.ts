import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  COX_FILTER,
  CustomerReadDto,
  FindBoostedWhereOption,
  INDEX_CONFIGURATION_KEY,
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ReportDataService } from '@app/_core/services/report.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { SubscriptionsLifecycle } from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { FilterService } from './services/filter.service';

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
  showedData: any;

  dataForFilters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
    formControl: FormControl;
  }[] = [];

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ReportDataService,
    private _filterService: FilterService,
  ) {
    super();
    this.showedData = this.data;

    this.dataForFilters.push({
      list: [],
      singleLabel: 'Cliente',
      multiLabel: 'Clienti',
      fieldName: COX_FILTER.CUSTOMER,
      formControl: new FormControl(),
    });
    const customersList: CustomerReadDto[] = [];
    this.data.forEach((data: any) => {
      customersList.push(data.release.project.customer);
    });
    this.dataForFilters.map((dataForFilter) => {
      if (dataForFilter.fieldName == COX_FILTER.CUSTOMER) {
        dataForFilter.list = customersList;
      }
    });
    this.dataForFilters.push({
      list: [
        'Formaggio',
        'Funghi',
        'Cipolla',
        'Peperoni',
        'Salsiccia',
        'Pomodoro',
      ],
      singleLabel: 'Progetto',
      multiLabel: 'Progetti',
      fieldName: COX_FILTER.PROJECT,
      formControl: new FormControl(),
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._setSubscriptions();
    this._load();
  }

  override _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._filterService.dataForFiltersObservable.subscribe(
        (dataForFilters) => (this.dataForFilters = dataForFilters),
      ),
    );
    super._setSubscriptions();
  }

  changeDataForFilters(): void {
    this._filterService.changeDataForFilters(this.dataForFilters);
  }

  updateFulltextSearch(fulltextSearch: string): void {
    this.indexTableHandler.status.fulltextSearch = fulltextSearch;
    this.indexTableHandler.statusChange(this.indexTableHandler.status);

    // this.showedData = this.data.filter((data: any) => {
    //   return (
    //     data.notes.includes(fulltextSearch) ||
    //     data.hours.includes(fulltextSearch) ||
    //     data.date.includes(fulltextSearch)
    //   );
    // });
    // this.indexTableHandler.data = this.showedData;
    // console.log(this.showedData);
  }

  onFilterEmit(filters: FindBoostedWhereOption[]): void {
    this.indexTableHandler.status.where = filters;
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }

  private _load(): Subscription {
    return this._configurationService
      .getConfiguration(this.CONFIGURATION_KEY)
      .subscribe((data) => {
        this.configuration = data.configuration;
        this.indexTableHandler.tableConfiguration = this.configuration;
        this._dataService
          .getMany({
            relations: this.indexTableHandler.tableConfiguration.relations,
          })
          .subscribe((apiResult) => {
            this.data = apiResult.data;
            this.showedData = apiResult.data;
            const customersList: CustomerReadDto[] = [];
            this.data.forEach((data: any) => {
              customersList.findIndex(
                (customer) => customer._id == data.release.project.customer._id,
              ) == -1 && customersList.push(data.release.project.customer);
            });
            this.dataForFilters.push({
              list: [],
              singleLabel: 'Cliente',
              multiLabel: 'Clienti',
              fieldName: COX_FILTER.CUSTOMER,
              formControl: new FormControl(),
            });
            this.dataForFilters.map((dataForFilter) => {
              if (dataForFilter.fieldName == COX_FILTER.CUSTOMER) {
                dataForFilter.list = customersList;
              }
            });
            this.changeDataForFilters();
          });
        this.isFirstLoadDone.next(true);
      });
  }
}
