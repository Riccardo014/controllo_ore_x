import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

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

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _projectDataService: ProjectDataService,
    ) {}

  ngOnInit(): void {
    this.projectId = this.getProjectId();
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }
  
  navigateBack(): void {
    this._router.navigate(['../../'], {
      relativeTo: this._activatedRoute,
    });
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._getProject(),
    );
  }

  /**
  * Return the project's id.
  */
  getProjectId(): string {
    return this._activatedRoute.snapshot.params['projectId'];
  }

  _getProject(): Subscription {
    return this._projectDataService.getOne(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  openCreateReleaseDialog(): void {
    this._router.navigate([this._router.url + '/create']);
  }

  openEditProjectDialog(): void {
    this._router.navigate(['../'], {
      relativeTo: this._activatedRoute,
    });
  }

}