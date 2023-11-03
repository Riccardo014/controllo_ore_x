import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiResponse, HoursTagReadDto, ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { convertNumberToHours } from '@app/utils/NumberToHoursConverter';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-release-status-data',
  templateUrl: './release-status-data.component.html',
  styleUrls: ['./release-status-data.component.scss'],
})
export class ReleaseStatusDataComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() releaseId!: string;

  @Input() wasReleaseUpdated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  release?: ReleaseReadDto;

  hoursExecuted: number = 0;
  hoursOutOfBudget: number = 0;
  tags: {
    hoursTag: HoursTagReadDto;
    hours: number;
  }[] = [];

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

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
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
    this.hoursOutOfBudget = 0;
    this.tags = [];
    const tagsIds: Set<string> = new Set<string>();

    for (const userHour of this.release.userHours) {
      this.hoursExecuted += Number(userHour.hours);
    }
    this.hoursOutOfBudget =
      this.release.hoursBudget - this.hoursExecuted < 0
        ? Math.abs(this.release.hoursBudget - this.hoursExecuted)
        : 0;

    for (const userHour of this.release.userHours) {
      if (!tagsIds.has(userHour.hoursTagId)) {
        this.tags.push({
          hoursTag: userHour.hoursTag!,
          hours: Number(userHour.hours),
        });
        tagsIds.add(userHour.hoursTagId);
      } else {
        this.tags.forEach((tag) => {
          if (tag.hoursTag._id === userHour.hoursTagId) {
            tag.hours += Number(userHour.hours);
          }
        });
      }
    }
  }
}
