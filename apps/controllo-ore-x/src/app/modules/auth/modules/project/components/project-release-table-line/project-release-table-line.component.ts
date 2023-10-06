import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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

  @Output() onReleaseUpdatedEvent: EventEmitter<void> =
    new EventEmitter<void>();

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _userHoursDataService: UserHoursDataService,
    private _rtDialogService: RtDialogService,
  ) {}

  ngOnInit(): void {
    if (!this.release) {
      throw new Error('release is undefined');
    }
    this._formatDeadline(this.release.deadline);

    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._sethoursExecutedProperty());
  }

  openEditReleaseDialog(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ReleaseDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: this.release,
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.onReleaseUpdatedEvent.emit();
          }
        }),
    );
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }

  private _sethoursExecutedProperty(): Subscription {
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
