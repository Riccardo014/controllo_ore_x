import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiResponse, ProjectReadDto, ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-release-index',
  templateUrl: './project-release-index.page.html',
  styleUrls: ['./project-release-index.page.scss'],
})
export class ProjectReleaseIndexPage
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() project!: ProjectReadDto;

  @Input() isNewReleaseCreated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  releases: ReleaseReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _releaseDataService: ReleaseDataService) {}

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this._onNewReleaseCreated(),
      this._getReleases(),
    );
  }

  private _onNewReleaseCreated(): Subscription {
    return this.isNewReleaseCreated.subscribe(() => {
      this.subscriptionsList.push(this._getReleases());
    });
  }

  private _getReleases(): Subscription {
    return this._releaseDataService
      .getMany({
        where: { projectId: this.project._id },
      })
      .subscribe((releases: ApiResponse<ReleaseReadDto[]>) => {
        this.releases = releases.data;
      });
  }
}
