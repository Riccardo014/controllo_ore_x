import { Component } from '@angular/core';
import {
  COX_FILTER,
  CustomerReadDto,
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
  UserHoursReadDto,
  UserHoursCreateDto,
  UserHoursUpdateDto
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
  ) {
    super();
  }

  setFilters(): void {
    this.dataForFilters = [];
    const customersList: CustomerReadDto[] = [];
    this.indexTableHandler.data.forEach((data: any) => {
      customersList.findIndex(
        (customer) => customer._id == data.release.project.customer._id,
      ) == -1 && customersList.push(data.release.project.customer);
    });
    this.insertNewFilter(
      'Cliente',
      'Clienti',
      COX_FILTER.CUSTOMER,
      customersList,
    );

    const projectsList: ProjectReadDto[] = [];
    this.indexTableHandler.data.forEach((data: any) => {
      projectsList.findIndex(
        (project) => project._id == data.release.project._id,
      ) == -1 && projectsList.push(data.release.project);
    });
    this.insertNewFilter(
      'Progetto',
      'Progetti',
      COX_FILTER.PROJECT,
      projectsList,
    );

    const releaseList: ReleaseReadDto[] = [];
    this.indexTableHandler.data.forEach((data: any) => {
      releaseList.findIndex((release) => release._id == data.release._id) ==
        -1 && releaseList.push(data.release);
    });
    this.insertNewFilter('Release', 'Release', COX_FILTER.RELEASE, releaseList);

    const teamList: UserReadDto[] = [];
    this.indexTableHandler.data.forEach((data: any) => {
      teamList.findIndex((user) => user._id == data.user._id) == -1 &&
        teamList.push(data.user);
    });
    this.insertNewFilter('Membro', 'Membri', COX_FILTER.TEAM, teamList);

    const hoursTagList: HoursTagReadDto[] = [];
    this.indexTableHandler.data.forEach((data: any) => {
      hoursTagList.findIndex((hoursTag) => hoursTag._id == data.hoursTag._id) ==
        -1 && hoursTagList.push(data.hoursTag);
    });
    this.insertNewFilter(
      'Etichetta',
      'Etichette',
      COX_FILTER.TAG,
      hoursTagList,
    );
  }
}
