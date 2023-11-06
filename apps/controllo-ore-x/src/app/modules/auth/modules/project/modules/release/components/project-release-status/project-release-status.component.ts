import { Component, Input } from '@angular/core';
import {
  ApiPaginatedResponse,
  ApiResponse,
  COX_FILTER,
  FindBoostedWhereOption,
  HoursTagReadDto,
  INDEX_CONFIGURATION_KEY,
  IndexConfigurationReadDto,
  ReleaseReadDto,
  UserHoursReadDto,
  UserReadDto,
} from '@api-interfaces';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import { TrackerDataService } from '@app/_core/services/tracker.data-service';
import { ReportPage } from '@app/_shared/classes/report-page.class';
import { CalendarDateService } from '@app/_shared/components/index-template/services/calendar-date.service';
import { FilterService } from '@app/_shared/components/report-template/services/filter.service';
import { HOURS_TAG_SEED } from 'apps/api/src/app/modules/user-hours/seeds/hours-tag.seed';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-release-status',
  templateUrl: './project-release-status.component.html',
  styleUrls: ['./project-release-status.component.scss'],
})
export class ProjectReleaseStatusComponent extends ReportPage<
  UserHoursReadDto,
  UserHoursReadDto,
  UserHoursReadDto
> {
  @Input() projectId!: string;

  titleIcon: string | null = '';
  title: string = '';
  pageTitle = '';
  buttonIcon = '';
  buttonText = '';
  subTitle: string = 'Totale ore:';
  subTitleHours: number = 0;

  override isTableTopbarVisible: boolean = false;
  override isCompletePage: boolean = false;
  override areDateFiltersActive: boolean = false;

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY =
    INDEX_CONFIGURATION_KEY.PROJECT_HOURS;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: TrackerDataService,
    protected _loadingService: RtLoadingService,
    protected _filterService: FilterService,
    protected _calendarDateService: CalendarDateService,

    private _releaseDataService: ReleaseDataService,
    private _teamDataService: TeamDataService,
    private _hoursTagDataService: HoursTagDataService,
  ) {
    super();
  }

  setFilters(): void {
    this.dataForFilters = [];

    this.subscriptionsList.push(
      this._releaseDataService
        .getMany({
          where: { projectId: this.projectId },
        })
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
          let index = 0;
          for (const hoursTag of hoursTags.data) {
            if (hoursTag._id === HOURS_TAG_SEED[0]._id) {
              break;
            }
            index++;
          }
          if (index > -1) {
            hoursTags.data.splice(index, 1);
          }
          this.insertNewFilter(
            'Etichetta',
            'Etichette',
            COX_FILTER.TAG,
            hoursTags.data,
          );
        }),
    );
  }

  override async firstLoad(): Promise<void> {
    const configuration = this._configurationService.getConfiguration(
      this.CONFIGURATION_KEY,
    );

    const configurationResult: ApiResponse<IndexConfigurationReadDto> =
      await firstValueFrom(configuration);
    this.configuration = configurationResult.data.configuration;
    this.indexTableHandler.tableConfiguration = this.configuration;
    this.isFirstLoadDone.next(true);

    const data = this._dataService.getMany({
      relations: this.indexTableHandler.tableConfiguration!.relations,
      where: { release: { projectId: this.projectId } },
    });

    const dataResult: ApiPaginatedResponse<UserHoursReadDto> =
      await firstValueFrom(data);
    this.indexTableHandler.data = dataResult.data;
    this.setFilters();
    this.changeDataForFilters();
    this.indexTableHandler.status.where = [
      { release: { projectId: this.projectId } },
    ];
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
    this.isLoading.next(false);
  }

  override onFilterEmit(filters: FindBoostedWhereOption[]): void {
    if (filters[0] && filters[0]['release']) {
      super.onFilterEmit(filters);
      return;
    }
    this.indexTableHandler.status.where = [
      { ...filters[0], release: { projectId: this.projectId } },
    ];
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }
}
