import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, ReleaseReadDto, UserHoursReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
import { convertNumberToHours } from '@app/utils/NumberToHoursConverter';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-report-index',
  templateUrl: './report-index.page.html',
  styleUrls: ['./report-index.page.scss'],
})
export class ReportIndexPage
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  releaseId!: string;

  release: any;

  hoursExecuted: number = 0;
  deadline: string = '';

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _releaseDataService: ReleaseDataService,
    private _userHoursDataService: UserHoursDataService,
  ) {}

  ngOnInit(): void {
    this.releaseId = this._getReleaseId();

    if (!this.releaseId) {
      throw new Error('releaseId is required');
    }

    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  navigateBack(): void {
    this._router.navigate(['../../'], {
      relativeTo: this._activatedRoute,
    });
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._getRelease(), this._getHoursExecuted());
  }

  calculatedHoursOutOfBudget(): string {
    if (this.hoursExecuted - this.release.hoursBudget <= 0) {
      return '00:00';
    }
    return this.convertNumberToHours(
      this.hoursExecuted - this.release.hoursBudget,
    );
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }

  toggleCompletion(): void {
    this._releaseDataService
      .update(this.releaseId, {
        isCompleted: !this.release.isCompleted,
      })
      .subscribe(() => {
        this._getRelease();
      });
  }

  /**
   * Return the release's id.
   */
  private _getReleaseId(): string {
    return this._activatedRoute.snapshot.params['id'];
  }

  private _getRelease(): Subscription {
    return this._releaseDataService
      .getOne(this.releaseId)
      .subscribe((release: ApiResponse<ReleaseReadDto>) => {
        this.release = release.data;
        this._formatDeadline(this.release.deadline);
      });
  }

  private _formatDeadline(deadline: Date): void {
    this.deadline = new Intl.DateTimeFormat(navigator.language).format(
      new Date(deadline),
    );
  }

  private _getHoursExecuted(): Subscription {
    return this._userHoursDataService
      .getMany({
        where: { releaseId: this.releaseId },
      })
      .subscribe((userHours: ApiResponse<UserHoursReadDto[]>) => {
        userHours.data.forEach((userHour: UserHoursReadDto) => {
          this.hoursExecuted += Number(userHour.hours);
        });
      });
  }
}
