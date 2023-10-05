import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  INDEX_CONFIGURATION_KEY,
  ReleaseCreateDto,
  ReleaseReadDto,
  ReleaseUpdateDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-release-index',
  templateUrl: './release-index.page.html',
  styleUrls: ['./release-index.page.scss'],
})
export class ReleaseIndexPage extends IndexPage<
  ReleaseReadDto,
  ReleaseCreateDto,
  ReleaseUpdateDto
> {
  titleIcon: string | null = 'egg_alt';
  title: string = 'Release';
  pageTitle = 'Release';
  buttonIcon = 'egg_alt';
  buttonText = 'Nuova Release';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.RELEASE;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = true;
  override isTableTopbarVisible: boolean = false;
  override isCompletePage: boolean = false;
  override isTableHeaderVisible: boolean = false;

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ReleaseDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
  ) {
    super();
  }

  openDialogFn($event: ReleaseReadDto): void {
    this.openDialog.emit($event);
    this._router.navigate([this._router.url + '/' + $event._id]);
  }
}
