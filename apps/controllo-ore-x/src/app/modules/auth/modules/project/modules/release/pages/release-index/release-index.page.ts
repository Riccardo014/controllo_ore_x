import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RtDialogService } from '@controllo-ore-x/rt-shared';
import { Subscription } from 'rxjs';
import { ProjectDialog } from '../../../../dialogs/project-dialog/project.dialog';
import { ReleaseDialog } from '../../dialogs/release-dialog/release.dialog';

@Component({
  selector: 'controllo-ore-x-release-index',
  templateUrl: './release-index.page.html',
  styleUrls: ['./release-index.page.scss'],
})
export class ReleaseIndexPage
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  projectId!: string;

  project: any;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _projectDataService: ProjectDataService,
    private _rtDialogService: RtDialogService,
  ) {}

  ngOnInit(): void {
    this.projectId = this.getProjectId();
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

  /**
   * Return the project's id.
   */
  getProjectId(): string {
    return this._activatedRoute.snapshot.params['projectId'];
  }

  _getProject(): Subscription {
    return this._projectDataService
      .getOne(this.projectId)
      .subscribe((project) => {
        this.project = project;
      });
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
          data: {
            ...this.project,
            transactionStatus: 'create',
          },
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
        .subscribe(),
    );
  }
}
