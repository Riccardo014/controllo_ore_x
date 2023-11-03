import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  ApiResponse,
  COX_FILTER,
  FindBoostedWhereOption,
  INDEX_CONFIGURATION_KEY,
  IndexConfigurationReadDto,
  ReleaseReadDto,
  UserHoursReadDto,
} from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { BehaviorSubject, Subscription, firstValueFrom } from 'rxjs';
import { ReleaseDialog } from '../../dialogs/release-dialog/release.dialog';
import { ReportPage } from '@app/_shared/classes/report-page.class';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { TrackerDataService } from '@app/_core/services/tracker.data-service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { FilterService } from '@app/_shared/components/report-template/services/filter.service';
import { CalendarDateService } from '@app/_shared/components/index-template/services/calendar-date.service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';

@Component({
  selector: 'controllo-ore-x-report-index',
  templateUrl: './report-index.page.html',
  styleUrls: ['./report-index.page.scss'],
})
export class ReportIndexPage extends ReportPage<
  UserHoursReadDto,
  UserHoursReadDto,
  UserHoursReadDto
> {
  titleIcon: string | null = '';
  title: string = '';
  pageTitle = '';
  buttonIcon = '';
  buttonText = '';
  subTitle: string = '';
  subTitleHours: number = 0;

  override isTableTopbarVisible: boolean = false;
  override isCompletePage: boolean = false;
  override areDateFiltersActive: boolean = false;

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY =
    INDEX_CONFIGURATION_KEY.RELEASE_HOURS;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  releaseId!: string;

  release!: ReleaseReadDto;

  wasReleaseUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: TrackerDataService,
    protected _loadingService: RtLoadingService,
    protected _filterService: FilterService,
    protected _calendarDateService: CalendarDateService,

    private _rtDialogService: RtDialogService,

    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _releaseDataService: ReleaseDataService,

    private _teamDataService: TeamDataService,
    private _hoursTagDataService: HoursTagDataService,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.releaseId = this._getReleaseId();

    if (!this.releaseId) {
      throw new Error('releaseId is required');
    }

    this.setSubscriptions();
    super.ngOnInit();
  }

  override setSubscriptions(): void {
    this.subscriptionsList.push(this._getRelease());
  }

  navigateBack(): void {
    this._router.navigate(['../../'], {
      relativeTo: this._activatedRoute,
    });
  }

  toggleCompletion(): void {
    this._releaseDataService
      .update(this.releaseId, {
        isCompleted: !this.release.isCompleted,
      })
      .subscribe({
        next: () => {
          this.wasReleaseUpdated.next(true);
          this._getRelease();
        },
        error: (error: any) => {
          throw new Error(error);
        },
      });
  }

  openEditDialog(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ReleaseDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: this.release,
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.wasReleaseUpdated.next(true);
            this._getRelease();
          }
          if (res.result === RT_DIALOG_CLOSE_RESULT.DELETE) {
            this.navigateBack();
          }
        }),
    );
  }

  setFilters(): void {
    this.dataForFilters = [];

    this.subscriptionsList.push(
      this._teamDataService.getMany({}).subscribe((teams) => {
        this.insertNewFilter('Membro', 'Membri', COX_FILTER.TEAM, teams.data);
      }),

      this._hoursTagDataService.getMany({}).subscribe((hoursTags) => {
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
      where: { releaseId: this.releaseId },
    });

    const dataResult: ApiPaginatedResponse<UserHoursReadDto> =
      await firstValueFrom(data);
    this.indexTableHandler.data = dataResult.data;
    this.setFilters();
    this.changeDataForFilters();
    this.indexTableHandler.status.where = [{ releaseId: this.releaseId }];
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
    this.isLoading.next(false);
  }

  override onFilterEmit(filters: FindBoostedWhereOption[]): void {
    this.indexTableHandler.status.where = [
      { ...filters[0], releaseId: this.releaseId },
    ];
    this.indexTableHandler.statusChange(this.indexTableHandler.status);
  }

  /**
   * Return the release's id.
   */
  private _getReleaseId(): string {
    return this._activatedRoute.snapshot.params['id'];
  }

  private _getRelease(): Subscription {
    return this._releaseDataService.getOne(this.releaseId).subscribe({
      next: (release: ApiResponse<ReleaseReadDto>) => {
        this.release = release.data;
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }
}
