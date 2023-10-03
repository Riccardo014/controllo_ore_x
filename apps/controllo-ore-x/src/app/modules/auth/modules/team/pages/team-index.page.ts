import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  INDEX_CONFIGURATION_KEY,
  UserCreateDto,
  UserReadDto,
  UserUpdateDto,
} from '@api-interfaces';
import { TeamDataService } from '@app/_core/services/team-data.service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { IndexConfigurationDataService } from '@core/services/index-configuration-data.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-team-index',
  templateUrl: './team-index.page.html',
  styleUrls: ['./team-index.page.scss'],
})
export class TeamIndexPage extends IndexPage<
  UserReadDto,
  UserCreateDto,
  UserUpdateDto
> {
  titleIcon: string | null = 'workspaces';
  title: string = 'Team';
  pageTitle = 'Team';
  buttonIcon = 'bakery_dining';
  buttonText = 'Nuovo Membro';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.TEAM;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: TeamDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
  ) {
    super();
  }

  openDialogFn($event: UserReadDto): void {
    this.openDialog.emit($event);
    this._router.navigate([this._router.url + '/' + $event._id]);
  }
}
