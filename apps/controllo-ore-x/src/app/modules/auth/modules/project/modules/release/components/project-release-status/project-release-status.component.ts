import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiPaginatedResponse, ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-release-status',
  templateUrl: './project-release-status.component.html',
  styleUrls: ['./project-release-status.component.scss'],
})
export class ProjectReleaseStatusComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  totalReleases = 0;
  inProgressReleases = 0;
  completedReleases = 0;

  @Input() projectId!: string;

  @Input() whereReleaseModified: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  tags: {
    hoursTagId: string;
    hours: number;
  }[] = [];

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _releaseDataService: ReleaseDataService) {}

  ngOnInit(): void {
    if (!this.projectId) {
      throw new Error('projectId is required');
    }
    if (typeof this.projectId !== 'string') {
      throw new Error('projectId must be a string');
    }
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this._onNewReleaseCreated(),
      this._fetchSetReleases(),
    );
  }

  private _onNewReleaseCreated(): Subscription {
    return this.whereReleaseModified.subscribe({
      next: (result: boolean) => {
        if (result) {
          this.subscriptionsList.push(this._fetchSetReleases());
          this.whereReleaseModified.next(false);
        }
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  private _fetchSetReleases(): Subscription {
    this.totalReleases = 0;
    this.inProgressReleases = 0;
    this.completedReleases = 0;
    this.tags = [];
    const tagsIds: Set<string> = new Set<string>();

    return this._releaseDataService
      .getMany({
        where: { projectId: this.projectId },
        relations: ['userHours', 'userHours.hoursTag'],
      })
      .subscribe((releases: ApiPaginatedResponse<ReleaseReadDto>) => {
        this.totalReleases = releases.data.length;
        for (const release of releases.data) {
          if (release.isCompleted) {
            this.completedReleases += 1;
          } else {
            for (const userHour of release.userHours) {
              if (Number(userHour.hours) > 0) {
                this.inProgressReleases += 1;
                break;
              }
            }
          }

          for (const userHour of release.userHours) {
            if (!tagsIds.has(userHour.hoursTagId)) {
              this.tags.push({
                hoursTagId: userHour.hoursTagId,
                hours: Number(userHour.hours),
              });
              tagsIds.add(userHour.hoursTagId);
            } else {
              this.tags.forEach((tag) => {
                if (tag.hoursTagId === userHour.hoursTagId) {
                  tag.hours += Number(userHour.hours);
                }
              });
            }
          }
        }
      });
  }
}
