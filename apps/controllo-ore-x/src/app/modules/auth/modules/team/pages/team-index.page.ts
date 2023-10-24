import { Component, EventEmitter, Output } from '@angular/core';
import {
  INDEX_CONFIGURATION_KEY,
  UserCreateDto,
  UserReadDto,
  UserUpdateDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject } from 'rxjs';
import { TeamDialog } from '../dialogs/team-dialog/team.dialog';

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
  buttonIcon = 'workspaces';
  buttonText = 'Nuovo Membro';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.TEAM;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: TeamDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
  ) {
    super();
  }

  openDialogFn($event: UserReadDto): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(TeamDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: $event,
        })
        .subscribe(),
    );
  }

  createFn(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(TeamDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
        })
        .subscribe(),
    );
  }
}
