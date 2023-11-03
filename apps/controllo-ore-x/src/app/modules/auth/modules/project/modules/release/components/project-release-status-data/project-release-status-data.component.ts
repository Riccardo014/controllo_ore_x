import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ApiPaginatedResponse,
  ApiResponse,
  ProjectReadDto,
  ReleaseReadDto,
} from '@api-interfaces';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { convertNumberToHours } from '@app/utils/NumberToHoursConverter';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-release-status-data',
  templateUrl: './project-release-status-data.component.html',
  styleUrls: ['./project-release-status-data.component.scss'],
})
export class ProjectReleaseStatusDataComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  totalReleases = 0;
  inProgressReleases = 0;
  completedReleases = 0;
  billableHours = 0;
  hoursExecuted = 0;
  totalHoursBudget = 0;
  hoursOutOfBudget = 0;

  @Input() projectId!: string;

  project?: ProjectReadDto;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _projectDataService: ProjectDataService,
    private _releaseDataService: ReleaseDataService,
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
    this.subscriptionsList.push(this._getProject(), this._fetchSetReleases());
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }

  private _getProject(): Subscription {
    return this._projectDataService.getOne(this.projectId).subscribe({
      next: (project: ApiResponse<ProjectReadDto>) => {
        this.project = project.data;
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
    this.billableHours = 0;
    this.hoursExecuted = 0;
    this.totalHoursBudget = 0;
    this.hoursOutOfBudget = 0;

    return this._releaseDataService
      .getMany({
        where: { projectId: this.projectId },
        relations: ['userHours', 'userHours.hoursTag'],
      })
      .subscribe((releases: ApiPaginatedResponse<ReleaseReadDto>) => {
        this.totalReleases = releases.data.length;
        for (const release of releases.data) {
          this.billableHours += Number(release.billableHoursBudget);
          this.totalHoursBudget += Number(release.hoursBudget);
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
            this.hoursExecuted += Number(userHour.hours);
          }
        }
        this.hoursOutOfBudget =
          this.totalHoursBudget - this.hoursExecuted < 0
            ? Math.abs(this.totalHoursBudget - this.hoursExecuted)
            : 0;
      });
  }
}
