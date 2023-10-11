import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
import { SubscriptionsLifecycle, completeSubscriptions } from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-release-status',
  templateUrl: './project-release-status.component.html',
  styleUrls: ['./project-release-status.component.scss'],
})
export class ProjectReleaseStatusComponent 
implements OnInit, OnDestroy, SubscriptionsLifecycle{

  totalReleases = 0;
  inProgressReleases = 0;
  doneReleases = 0;

  @Input() projectId!: string;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _releaseDataService: ReleaseDataService,
    private _userHoursDataService: UserHoursDataService
  ) {}
  
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
      where: { projectId: this.projectId }
    }).subscribe((releases) => {
      console.log(releases);
      this.totalReleases = releases.data.length;
      releases.data.forEach(release => {
        if (release.isCompleted) {
          this.doneReleases += 1;
          return;
        }
        this._userHoursDataService
        .getMany({
          where: { releaseId: release._id },
        })
        .subscribe((userHours: any) => {
          if (userHours.data.length > 0) {
            this.inProgressReleases += 1;
          }
        });
      });
    });
  }
}
