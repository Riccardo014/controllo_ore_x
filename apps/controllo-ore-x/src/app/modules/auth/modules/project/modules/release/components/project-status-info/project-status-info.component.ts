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
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-status-info',
  templateUrl: './project-status-info.component.html',
  styleUrls: ['./project-status-info.component.scss'],
})
export class ProjectStatusInfoComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() projectId!: string;

  @Input() wasProjectUpdated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  project?: ProjectReadDto;

  hoursExecuted: number = 0;
  totalHoursBudget: number = 0;
  billableHours: number = 0;
  isCompleted: boolean = true;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _projectDataService: ProjectDataService,
    private _releaseDataService: ReleaseDataService,
  ) {}

  ngOnInit(): void {
    if (!this.projectId) {
      throw new Error('Project id is required');
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
    this.subscriptionsList.push(this._getProject(), this._onProjectUpdated());
  }

  formatDate(deadline: Date | string): string {
    return new Intl.DateTimeFormat(navigator.language).format(
      new Date(deadline),
    );
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }

  private _getProject(): Subscription {
    return this._projectDataService.getOne(this.projectId).subscribe({
      next: (project: ApiResponse<ProjectReadDto>) => {
        this.project = project.data;
        this.subscriptionsList.push(this._getProjectReleasesData());
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  private _getProjectReleasesData(): Subscription {
    this.hoursExecuted = 0;
    this.totalHoursBudget = 0;
    this.billableHours = 0;

    return this._releaseDataService
      .getMany({
        where: { projectId: this.projectId },
        relations: ['userHours'],
      })
      .subscribe({
        next: (releases: ApiPaginatedResponse<ReleaseReadDto>) => {
          for (const release of releases.data) {
            this.billableHours += Number(release.billableHoursBudget);
            this.totalHoursBudget += Number(release.hoursBudget);
            if (!release.isCompleted) {
              this.isCompleted = false;
            }
            for (const userHour of release.userHours) {
              this.hoursExecuted += Number(userHour.hours);
            }
          }
        },
        error: (error: any) => {
          throw new Error(error);
        },
      });
  }

  private _onProjectUpdated(): Subscription {
    return this.wasProjectUpdated.subscribe({
      next: (result: boolean) => {
        if (result) {
          this.subscriptionsList.push(this._getProject());
          this.wasProjectUpdated.next(false);
        }
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }
}
