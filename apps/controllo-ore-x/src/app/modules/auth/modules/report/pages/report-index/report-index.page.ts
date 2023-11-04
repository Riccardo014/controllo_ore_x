import { Component } from '@angular/core';
import {
  ActivityCreateDto,
  ActivityReadDto,
  ActivityUpdateDto,
  ApiPaginatedResponse,
  COX_FILTER,
  CustomerReadDto,
  HoursTagReadDto,
  INDEX_CONFIGURATION_KEY,
  ProjectReadDto,
  ReleaseReadDto,
  UserReadDto,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { ReportDataService } from '@app/_core/services/report.data-service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import { ReportPage } from '@app/_shared/classes/report-page.class';
import { CalendarDateService } from '@app/_shared/components/index-template/services/calendar-date.service';
import { FilterService } from '@app/_shared/components/report-template/services/filter.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-report-index',
  templateUrl: './report-index.page.html',
  styleUrls: ['./report-index.page.scss'],
})
export class ReportIndexPage extends ReportPage<
  ActivityReadDto,
  ActivityCreateDto,
  ActivityUpdateDto
> {
  titleIcon: string | null = 'chair';
  title: string = 'Report';
  pageTitle = 'Report';
  buttonIcon = 'chair';
  buttonText = '';
  subTitle: string = 'Totale ore:';
  subTitleHours: number = 0;
  selectedDate: Date = new Date();

  override isTableTopbarVisible: boolean = false;

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.REPORT;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ReportDataService,
    protected _loadingService: RtLoadingService,
    protected _filterService: FilterService,
    protected _calendarDateService: CalendarDateService,

    private _customerDataService: CustomerDataService,
    private _projectDataService: ProjectDataService,
    private _releaseDataService: ReleaseDataService,
    private _teamDataService: TeamDataService,
    private _hoursTagDataService: HoursTagDataService,
  ) {
    super();
  }

  setFilters(): void {
    this.dataForFilters = [];

    this.subscriptionsList.push(
      this._customerDataService
        .getMany({})
        .subscribe((customers: ApiPaginatedResponse<CustomerReadDto>) => {
          this.insertNewFilter(
            'Cliente',
            'Clienti',
            COX_FILTER.CUSTOMER,
            customers.data,
          );
        }),

      this._projectDataService
        .getMany({})
        .subscribe((projects: ApiPaginatedResponse<ProjectReadDto>) => {
          this.insertNewFilter(
            'Progetto',
            'Progetti',
            COX_FILTER.PROJECT,
            projects.data,
          );
        }),

      this._releaseDataService
        .getMany({})
        .subscribe((releases: ApiPaginatedResponse<ReleaseReadDto>) => {
          this.insertNewFilter(
            'Release',
            'Release',
            COX_FILTER.RELEASE,
            releases.data,
          );
        }),

      this._teamDataService
        .getMany({})
        .subscribe((teams: ApiPaginatedResponse<UserReadDto>) => {
          this.insertNewFilter('Membro', 'Membri', COX_FILTER.TEAM, teams.data);
        }),

      this._hoursTagDataService
        .getMany({})
        .subscribe((hoursTags: ApiPaginatedResponse<HoursTagReadDto>) => {
          this.insertNewFilter(
            'Etichetta',
            'Etichette',
            COX_FILTER.TAG,
            hoursTags.data,
          );
        }),
    );
  }
}
