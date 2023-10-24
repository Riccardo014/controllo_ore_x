import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  INDEX_CONFIGURATION_KEY,
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { AuthService } from '@app/_core/services/auth.service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ReportDataService } from '@app/_core/services/report.data-service';
import { ReportPage } from '@app/_shared/classes/report-page.class';
import { CalendarDateService } from '@app/_shared/components/index-template/servicies/calendar-date.service';
import { FilterService } from '@app/_shared/components/report-template/services/filter.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
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
  selectedDate: Date = new Date();

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.REPORT;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ReportDataService,
    protected _loadingService: RtLoadingService,
    protected _filterService: FilterService,
    private _rtDialogService: RtDialogService,
    private _authService: AuthService,
    private _router: Router,
    protected _calendarDateService: CalendarDateService,
  ) {
    super();
  }

  openDialogFn($event: UserHoursReadDto): void {
    this.openDialog.emit($event);
    this._router.navigate([this._router.url + '/' + $event._id]);
  }

  openCreateDialog(): void {
    this._router.navigate([this._router.url + '/create']);
  }
}
