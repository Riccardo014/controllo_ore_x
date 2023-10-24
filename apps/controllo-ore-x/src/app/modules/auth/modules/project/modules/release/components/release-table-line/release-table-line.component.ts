import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReleaseReadDto } from '@api-interfaces';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
import { convertNumberToHours } from '@app/utils/NumberToHoursConverter';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RtDialogService } from '@controllo-ore-x/rt-shared';
import { Subscription } from 'rxjs';
import { ReleaseDialog } from '../../dialogs/release-dialog/release.dialog';

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
    private _router: Router,
    private _rtDialogService: RtDialogService,
  ) {}

  ngOnInit(): void {
    if (!this.release) {
      throw new Error('release is required');
    }
    if (typeof this.release !== 'object') {
      throw new Error('release must be a ReleaseReadDto object');
    }
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

  openEditRelease($event: ReleaseReadDto): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ReleaseDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: $event,
        })
        .subscribe(),
    );
  }

  openReportDialog($event: ReleaseReadDto): void {
    this._router.navigate([this._router.url + '/report/' + $event._id]);
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }
}
