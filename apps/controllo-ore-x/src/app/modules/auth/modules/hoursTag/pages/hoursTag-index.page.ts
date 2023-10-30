import { Component, EventEmitter, Output } from '@angular/core';
import {
  HoursTagCreateDto,
  HoursTagReadDto,
  HoursTagUpdateDto,
  INDEX_CONFIGURATION_KEY,
} from '@api-interfaces';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { RT_DIALOG_CLOSE_RESULT } from '@controllo-ore-x/rt-shared';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject } from 'rxjs';
import { HoursTagDialog } from '../dialogs/hoursTag-dialog/hoursTag.dialog';

@Component({
  selector: 'controllo-ore-x-hoursTag-index',
  templateUrl: './hoursTag-index.page.html',
  styleUrls: ['./hoursTag-index.page.scss'],
})
export class HoursTagIndexPage extends IndexPage<
  HoursTagReadDto,
  HoursTagCreateDto,
  HoursTagUpdateDto
> {
  titleIcon: string | null = 'sports_tennis';
  title: string = 'Etichette';
  pageTitle = 'Etichette';
  buttonIcon = 'sports_tennis';
  buttonText = 'Nuova etichetta';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.HOURSTAG;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  @Output() openDialogEvent: EventEmitter<HoursTagReadDto> =
    new EventEmitter<HoursTagReadDto>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: HoursTagDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
  ) {
    super();
  }

  openDialogFn(hoursTag: HoursTagReadDto): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(HoursTagDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: hoursTag,
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.indexTableHandler.fetchData();
          }
        }),
    );
  }

  createFn(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(HoursTagDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.indexTableHandler.fetchData();
          }
        }),
    );
  }
}
