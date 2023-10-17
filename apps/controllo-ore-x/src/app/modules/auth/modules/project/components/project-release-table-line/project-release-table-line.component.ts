import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReleaseReadDto } from '@api-interfaces';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RtDialogService } from '@controllo-ore-x/rt-shared';
import { Subscription } from 'rxjs';
import { ReleaseDialog } from '../../modules/release/dialogs/release-dialog/release.dialog';

@Component({
  selector: 'controllo-ore-x-project-release-table-line',
  templateUrl: './project-release-table-line.component.html',
  styleUrls: ['./project-release-table-line.component.scss'],
})
export class ProjectReleaseTableLineComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  hoursExecuted: number = 0;
  deadline: string = '';

  @Input() release!: ReleaseReadDto;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _userHoursDataService: UserHoursDataService,
    private _rtDialogService: RtDialogService,
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

  openEditReleaseDialog(): void {
    this._rtDialogService
      .open(ReleaseDialog, {
        width: '600px',
        maxWidth: '600px',
        data: this.release,
      })
      .subscribe();
  }

  convertNumberToHours(number: number): string {
    const hours = Math.floor(number);
    const minutes = Math.round((number - hours) * 60).toString();
    return hours.toString().padStart(2, '0') + ':' + minutes.padStart(2, '0');
  }
}
