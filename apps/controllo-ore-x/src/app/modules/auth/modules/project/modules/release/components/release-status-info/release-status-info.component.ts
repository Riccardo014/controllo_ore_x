import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiResponse, ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-release-status-info',
  templateUrl: './release-status-info.component.html',
  styleUrls: ['./release-status-info.component.scss'],
})
export class ReleaseStatusInfoComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() releaseId!: string;

  @Input() wasReleaseUpdated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  release?: ReleaseReadDto;

  hoursExecuted: number = 0;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _releaseDataService: ReleaseDataService) {}

  ngOnInit(): void {
    if (!this.releaseId) {
      throw new Error('releaseId is required');
    }
    if (typeof this.releaseId !== 'string') {
      throw new Error('releaseId must be a string');
    }
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._getRelease(), this._onReleaseUpdated());
  }

  formatDate(deadline: Date | string): string {
    return new Intl.DateTimeFormat(navigator.language).format(
      new Date(deadline),
    );
  }

  private _onReleaseUpdated(): Subscription {
    return this.wasReleaseUpdated.subscribe({
      next: (result: boolean) => {
        if (result) {
          this.subscriptionsList.push(this._getRelease());
          this.wasReleaseUpdated.next(false);
        }
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  private _getRelease(): Subscription {
    return this._releaseDataService.getOne(this.releaseId).subscribe({
      next: (release: ApiResponse<ReleaseReadDto>) => {
        this.release = release.data;
        this._getReleaseData();
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  private _getReleaseData(): void {
    if (!this.release) {
      throw new Error('release is undefined');
    }

    this.hoursExecuted = 0;

    for (const userHour of this.release.userHours) {
      this.hoursExecuted += Number(userHour.hours);
    }
  }
}
