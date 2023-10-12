import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
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

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _releaseDataService: ReleaseDataService,
    private _userHoursDataService: UserHoursDataService,
    ) {}

  ngOnInit(): void {
    this.releaseId = this.getReleaseId();
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }
  
  navigateBack(): void {
    this._router.navigate(['../../'], {
      relativeTo: this._activatedRoute,
    });
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._getRelease(),
      this._getHoursExecuted(),
    );
  }

  /**
  * Return the release's id.
  */
  getReleaseId(): string {
    return this._activatedRoute.snapshot.params['id'];
  }

  _getRelease(): Subscription {
    return this._releaseDataService.getOne(this.releaseId).subscribe((release) => {
      this.release = release;
      this.formatDeadline(this.release.deadline);
    });
  }

  _getHoursExecuted(): Subscription {
    return this._userHoursDataService
    .getMany({
      where: { releaseId: this.releaseId },
    })
    .subscribe((userHours: any) => {
      userHours.data.forEach((userHour: any) => {
        this.hoursExecuted += parseFloat(userHour.hours);
      });
    });
  }

  formatDeadline(deadline: Date): void {
    this.deadline = new Date(deadline).toLocaleDateString();
  }

  calculatedHoursOutOfBudget(): string{
    if(this.hoursExecuted - this.release.hoursBudget <=0){
      return '00:00';
    } 
    return this.convertNumberToHours(this.hoursExecuted - this.release.hoursBudget);
  }

  convertNumberToHours(number: number): string {
    const hours = Math.floor(number);
    const minutes = Math.round((number - hours) * 60).toString();
    return hours.toString().padStart(2, '0') + ':' + minutes.padStart(2, '0');
  }

  toggleCompletion(): void {
    this._releaseDataService
      .update(this.releaseId, {
        isCompleted: !this.release.isCompleted,
      }).subscribe(()=> {
        this._getRelease();
      });
  }

}
