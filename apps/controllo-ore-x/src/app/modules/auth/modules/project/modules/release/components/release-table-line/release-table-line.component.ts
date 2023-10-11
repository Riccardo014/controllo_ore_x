import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReleaseReadDto } from '@api-interfaces';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
import { SubscriptionsLifecycle, completeSubscriptions } from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-release-table-line',
  templateUrl: './release-table-line.component.html',
  styleUrls: ['./release-table-line.component.scss'],
})
export class ReleaseTableLineComponent 
implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() release!: ReleaseReadDto;

  hoursExecuted: number = 0;
  deadline: string = '';

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _userHoursDataService: UserHoursDataService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.formatDeadline(this.release.deadline);

    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._userHoursDataService
        .getMany({
          where: { releaseId: this.release._id },
        })
        .subscribe((userHours: any) => {
          userHours.data.forEach((userHour: any) => {
            this.hoursExecuted += parseFloat(userHour.hours);
          });
        }),
    );
  }

  formatDeadline(deadline: Date): void {
    this.deadline = new Date(deadline).toLocaleDateString();
  }

  openDialogFn($event: ReleaseReadDto): void {
    this._router.navigate([this._router.url + '/' + $event._id]);
  }

}
