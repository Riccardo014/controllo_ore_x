import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  INDEX_CONFIGURATION_KEY,
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
  UserReadDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-index',
  templateUrl: './project-index.page.html',
  styleUrls: ['./project-index.page.scss'],
})
export class ProjectIndexPage extends IndexPage<
  ProjectReadDto,
  ProjectCreateDto,
  ProjectUpdateDto
> {
  titleIcon: string | null = 'workspaces';
  title: string = 'Progetti';
  pageTitle = 'Progetti';
  buttonIcon = 'bakery_dining';
  buttonText = 'Nuovo Membro';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.PROJECT;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ProjectDataService,
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
