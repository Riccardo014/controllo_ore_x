import { Component, OnInit } from '@angular/core';
import {
  COX_FILTER,
  INDEX_CONFIGURATION_KEY,
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ReportDataService } from '@app/_core/services/report.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { CoxFilter } from 'libs/utils';
import { Subscription } from 'rxjs';

/**
 * Template of a report page
 */
@Component({
  selector: 'controllo-ore-x-report-template',
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.scss'],
})
export class ReportTemplateComponent
  extends IndexPage<UserHoursReadDto, UserHoursCreateDto, UserHoursUpdateDto>
  implements OnInit
{
  titleIcon: string | null = 'chair';
  title: string = 'Report';
  pageTitle = 'Report';
  buttonIcon = 'chair';
  buttonText = '';

  override isCompletePage: boolean = false;
  override isTableTopbarVisible: boolean = false;

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.TRACKER;

  data: any;
  showedData: any;

  dataForFilters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
  }[] = [];

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ReportDataService,
  ) {
    super();
    this.showedData = this.data;

    this.dataForFilters.push({
      list: [
        'Extra cheese',
        'Mushroom',
        'Onion',
        'Pepperoni',
        'Sausage',
        'Tomato',
      ],
      singleLabel: 'Cliente',
      multiLabel: 'Clienti',
      fieldName: COX_FILTER.CUSTOMER,
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
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._load();
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

  onFilterEmit(filter: CoxFilter[]): void {
    console.log(filter);
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
            console.log(this.data);
          });
        this.isFirstLoadDone.next(true);
      });
  }
}
