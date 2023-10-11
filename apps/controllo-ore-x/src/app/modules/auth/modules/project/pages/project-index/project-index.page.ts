import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
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
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';

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

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  override subscriptionsList: Subscription[] = [];

  override _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: ProjectDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
  ) {
    super();
  }

  override ngOnInit(): void {
    this._setSubscriptions();
  }

  override ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  override _setSubscriptions(): void {
    this.subscriptionsList.push(this._getProjects());
  }

  _getProjects(): Subscription {
    return this._dataService
      .getMany({
        relations: ['customer']
      })
      .subscribe((projects: ApiPaginatedResponse<ProjectReadDto>) => {
        this.projects = projects.data;
        this.showedProjects = projects.data;
      });
  }

  openDialogFn($event: ProjectReadDto): void {
    this.openDialog.emit($event);
    this._router.navigate([this._router.url + '/' + $event._id]);
  }

  updateFulltextSearch(fulltextSearch: string): void {
    this.showedProjects = this.projects.filter((project: any) => {
      return (
        project.name.includes(fulltextSearch) || 
        project.customer.name.includes(fulltextSearch)
      );
    });
  }

}
