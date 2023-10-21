import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-release-table',
  templateUrl: './release-table.component.html',
  styleUrls: ['./release-table.component.scss'],
})
export class ReleaseTableComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() projectId!: string;

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  releases: ReleaseReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(protected _releaseDataService: ReleaseDataService) {}

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(this._getReleases());
  }

  _getReleases(): Subscription {
    return this._releaseDataService
      .getMany({
        where: { projectId: this.projectId },
        order: { version: 'DESC' },
      })
      .subscribe((releases: any) => {
        this.releases = releases.data;
        this.isLoading.next(false);
      });
  }
}
