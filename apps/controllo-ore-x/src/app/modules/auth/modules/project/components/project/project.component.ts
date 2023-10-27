import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProjectReadDto } from '@api-interfaces';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReleaseDialog } from '../../modules/release/dialogs/release-dialog/release.dialog';

@Component({
  selector: 'controllo-ore-x-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() project!: ProjectReadDto;

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output() duplicateEntityEvent: EventEmitter<any> = new EventEmitter<any>();

  isNewReleaseCreated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  isPanelOpen: boolean = false;
  customExpandedHeight: string = '90px';

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _rtDialogService: RtDialogService,
  ) {}

  ngOnInit(): void {
    if (!this.project) {
      throw new Error('Project is undefined');
    }
    this.setSubscriptions();
  }

  setSubscriptions(): void {
    this.subscriptionsList.push();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  openEditDialog(): void {
    this.openDialogEvent.emit(this.project);
  }

  openCreateReleaseDialog(): void {
    const dialogConfig = {
      width: '600px',
      maxWidth: '600px',
    };
    this.subscriptionsList.push(
      this._rtDialogService
        .open(ReleaseDialog, {
          width: dialogConfig.width,
          maxWidth: dialogConfig.maxWidth,
          data: {
            projectId: this.project._id,
            transactionStatus: 'create',
          },
        })
        .subscribe((res) => {
          if (res.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.isNewReleaseCreated.next(true);
          }
        }),
    );
  }

  navigateToReleaseIndex(): void {
    this._router.navigate([
      this._router.url + '/' + this.project._id + '/release',
    ]);
  }

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }

  /**
   * Emit a event to open a dialog to duplicate the entity.
   */
  openDuplicateDialog(): void {
    this.duplicateEntityEvent.emit(this.project);
  }
}
