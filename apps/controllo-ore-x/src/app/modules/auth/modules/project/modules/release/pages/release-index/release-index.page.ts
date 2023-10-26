import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { Subscription } from 'rxjs';
import { ProjectDialog } from '../../../../dialogs/project-dialog/project.dialog';
import { ReleaseDialog } from '../../dialogs/release-dialog/release.dialog';
import { ApiResponse, ProjectReadDto } from '@api-interfaces';

@Component({
  selector: 'controllo-ore-x-release-index',
  templateUrl: './release-index.page.html',
  styleUrls: ['./release-index.page.scss'],
})
export class ReleaseIndexPage
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  projectId?: string;
  project?: ProjectReadDto;

  isLoading: boolean = true;
  hasErrors: boolean = false;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _projectDataService: ProjectDataService,
    private _rtDialogService: RtDialogService,
  ) {
    this.projectId = this._getProjectId();
  }

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  navigateBack(): void {
    this._router.navigate(['../../'], {
      relativeTo: this._activatedRoute,
    });
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._getProject());
  }

  openCreateReleaseDialog(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ReleaseDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: this.project,
        })
        .subscribe(),
    );
  }

  openEditProjectDialog(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ProjectDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: this.project,
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.isLoading = true;
            this.setSubscriptions();
          }
          if (res.result === RT_DIALOG_CLOSE_RESULT.DELETE) {
            this.navigateBack();
          }
        }),
    );
  }

  /**
   * Return the project's id.
   */
  private _getProjectId(): string {
    return this._activatedRoute.snapshot.params['projectId'];
  }

  private _getProject(): Subscription {
    if (!this.projectId) {
      throw new Error('Project id is not defined.');
    }

    return this._projectDataService.getOne(this.projectId).subscribe({
      next: (project: ApiResponse<ProjectReadDto>) => {
        this.project = project.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }
}
