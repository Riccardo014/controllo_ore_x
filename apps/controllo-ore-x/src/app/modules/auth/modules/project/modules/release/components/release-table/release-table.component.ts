import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { INDEX_CONFIGURATION_KEY, ReleaseCreateDto, ReleaseReadDto, ReleaseUpdateDto, TableConfiguration } from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { SubscriptionsLifecycle, completeSubscriptions } from '@app/utils/subscriptions_lifecycle';
import { RtTableApiStatusManager } from '@controllo-ore-x/rt-shared';
import { RtTableStatus } from 'libs/rt-shared/src/rt-table/interfaces/rt-table-status.interface';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-release-table',
  templateUrl: './release-table.component.html',
  styleUrls: ['./release-table.component.scss'],
})
export class ReleaseTableComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle {

  @Input() projectId!: string;

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  releases: ReleaseReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    protected _releaseDataService: ReleaseDataService,
  ) { }

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._getReleases(),
    );
  }

  _getReleases(): Subscription {
    return this._releaseDataService.getMany({
      where: { projectId: this.projectId },
      order: { version: 'DESC' },
      }).subscribe((releases: any) => {
        this.releases = releases.data;
      });
  }

}
