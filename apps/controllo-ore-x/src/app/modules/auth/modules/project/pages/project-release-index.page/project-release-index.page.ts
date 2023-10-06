import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-release-index',
  templateUrl: './project-release-index.page.html',
  styleUrls: ['./project-release-index.page.scss'],
})
export class ProjectReleaseIndexPage
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() release!: ReleaseReadDto;

  releases: ReleaseReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _releaseDataService: ReleaseDataService) {}

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._releaseDataService
        .getMany({
          where: { releaseId: this.release._id },
        })
        .subscribe((releases: any) => {
          this.releases = releases.data;
        }),
    );
  }
}
