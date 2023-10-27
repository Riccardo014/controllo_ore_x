import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ApiPaginatedResponse,
  ReleaseReadDto,
  UserHoursReadDto,
} from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  concatMap,
  of,
} from 'rxjs';

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

  constructor(
    private _releaseDataService: ReleaseDataService,
    private _userHoursDataService: UserHoursDataService,
  ) {}

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
    return this.whereReleaseModified.subscribe(() => {
      this.subscriptionsList.push(this._fetchSetReleases());
    });
  }

  // _fetchSetReleases(): Subscription {
  //   return this._releaseDataService
  //     .getMany({
  //       where: { projectId: this.projectId },
  //     })
  //     .subscribe((releases: ApiPaginatedResponse<ReleaseReadDto>) => {
  //       this.totalReleases = releases.data.length;
  //       releases.data.forEach((release) => {
  //         if (release.isCompleted) {
  //           this.completedReleases += 1;
  //           return;
  //         }
  //         this._userHoursDataService
  //           .getMany({
  //             where: { releaseId: release._id },
  //           })
  //           .subscribe((userHours: ApiPaginatedResponse<UserHoursReadDto>) => {
  //             if (userHours.data.length > 0) {
  //               this.inProgressReleases += 1;
  //             }
  //             const tagsIds: Set<string> = new Set<string>();
  //             userHours.data.forEach((userHour: any) => {
  //               if (!tagsIds.has(userHour.hoursTagId)) {
  //                 this.tags.push({
  //                   hoursTagId: userHour.hoursTagId,
  //                   hours: Number(userHour.hours),
  //                 });
  //                 tagsIds.add(userHour.hoursTagId);
  //               } else {
  //                 this.tags.forEach((tag) => {
  //                   if (tag.hoursTagId === userHour.hoursTagId) {
  //                     tag.hours += Number(userHour.hours);
  //                   }
  //                 });
  //               }
  //             });
  //           });
  //       });
  //     });
  // }

  private _fetchSetReleases(): Subscription {
    return this._releaseDataService
      .getMany({ where: { projectId: this.projectId } })
      .pipe(
        concatMap((releases: any) => {
          this.totalReleases = releases.data.length;
          this.completedReleases = 0;
          this.inProgressReleases = 0;
          this.tags = [];

          return releases.data.reduce(
            (previous: any, release: ReleaseReadDto) => {
              return previous.pipe(
                concatMap(() => this._handleRelease(release)),
              );
            },
            of(null),
          );
        }),
        catchError((error) => {
          throw new Error(error.message);
        }),
      )
      .subscribe();
  }

  private _handleRelease(release: ReleaseReadDto): Observable<any> {
    if (release.isCompleted) {
      this.completedReleases += 1;
      return of(null);
    }

    return this._userHoursDataService
      .getMany({ where: { releaseId: release._id } })
      .pipe(
        concatMap((userHours: ApiPaginatedResponse<UserHoursReadDto>) => {
          if (userHours.data.length > 0) {
            this.inProgressReleases += 1;
          }

          const tagsIds: Set<string> = new Set<string>();
          userHours.data.forEach((userHour: any) => {
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
          });

          return of(null);
        }),
      );
  }
}
