import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse, ReleaseReadDto, UserHoursReadDto } from '@api-interfaces';
import { UserHoursDataService } from '@app/_core/services/user-hour.data-service';
import { convertNumberToHours } from '@app/utils/NumberToHoursConverter';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
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

  @Output() onReleaseUpdatedEvent: EventEmitter<void> =
    new EventEmitter<void>();

  hoursExecuted: number = 0;
  deadline: string = '';

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
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
    this._formatDeadline(this.release.deadline);

    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._getHoursExecuted());
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
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.onReleaseUpdatedEvent.emit();
          }
        }),
    );
  }

  openReleaseReport($event: ReleaseReadDto): void {
    this._router.navigate([this._router.url + '/report/' + $event._id]);
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }

  private _getHoursExecuted(): Subscription {
    return this._userHoursDataService
      .getMany({
        where: { releaseId: this.release._id },
      })
      .subscribe({
        next: (userHours: ApiResponse<UserHoursReadDto[]>) => {
          userHours.data.forEach((userHour: UserHoursReadDto) => {
            this.hoursExecuted += Number(userHour.hours);
          });
        },
        error: (error: any) => {
          throw new Error(error);
        },
      });
  }

  private _formatDeadline(deadline: Date): void {
    this.deadline = new Intl.DateTimeFormat(navigator.language).format(
      new Date(deadline),
    );
  }
}
