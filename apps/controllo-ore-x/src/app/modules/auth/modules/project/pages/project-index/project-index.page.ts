import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ApiPaginatedResponse,
  INDEX_CONFIGURATION_KEY,
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
} from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RT_DIALOG_CLOSE_RESULT } from '@controllo-ore-x/rt-shared';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProjectDialog } from '../../dialogs/project-dialog/project.dialog';

@Component({
  selector: 'controllo-ore-x-project-index',
  templateUrl: './project-index.page.html',
  styleUrls: ['./project-index.page.scss'],
})
export class ProjectIndexPage
  extends IndexPage<ProjectReadDto, ProjectCreateDto, ProjectUpdateDto>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  titleIcon: string | null = 'egg';
  title: string = 'Progetti';
  pageTitle = 'Progetti';
  buttonIcon = 'egg';
  buttonText = 'Nuovo Progetto';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.PROJECT;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;
  override isPageWithTable: boolean = false;

  projects: ProjectReadDto[] = [];
  showedProjects: ProjectReadDto[] = [];

  override subscriptionsList: Subscription[] = [];

  override completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ProjectDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.setSubscriptions();
  }

  override ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  override setSubscriptions(): void {
    this.subscriptionsList.push(this._getProjects());
  }

  _getProjects(): Subscription {
    return this._dataService
      .getMany({
        relations: ['customer'],
      })
      .subscribe((projects: ApiPaginatedResponse<ProjectReadDto>) => {
        this.projects = projects.data;
        this.showedProjects = projects.data;
        this.isLoading.next(false);
      });
  }

  updateFulltextSearch(fulltextSearch: string): void {
    this.showedProjects = this.projects.filter((project: any) => {
      return (
        project.name.includes(fulltextSearch) ||
        project.customer.name.includes(fulltextSearch)
      );
    });
  }

  openDialogFn($event: ProjectReadDto): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ProjectDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: $event,
        })
        .subscribe((res) => {
          if (
            res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM ||
            res.result === RT_DIALOG_CLOSE_RESULT.DELETE
          ) {
            this.setSubscriptions();
          }
        }),
    );
  }

  duplicateFn($event: ProjectReadDto): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ProjectDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: {
            ...$event,
            transactionStatus: 'duplicate',
          },
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.setSubscriptions();
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
        .open(ProjectDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.setSubscriptions();
          }
        }),
    );
  }
}
