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
import { RtDialogService } from '@controllo-ore-x/rt-shared';
import { Subscription } from 'rxjs';
import { ReleaseDialog } from '../../modules/release/dialogs/release-dialog/release.dialog';

@Component({
  selector: 'controllo-ore-x-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() projectWithCustomer!: ProjectReadDto;

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output() duplicateEntityEvent: EventEmitter<any> = new EventEmitter<any>();

  isPanelOpen: boolean = false;
  customExpandedHeight: string = '90px';

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _router: Router,
    private _rtDialogService: RtDialogService,
  ) {}

  ngOnInit(): void {
    if (!this.projectWithCustomer) {
      throw new Error('ProjectWithCustomer is undefined');
    }
    this._setSubscriptions();
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  openEditDialog(): void {
    this.openDialogEvent.emit(this.projectWithCustomer);
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
            ...this.projectWithCustomer,
            transactionStatus: 'create',
          },
        })
        .subscribe(),
    );
  }

  navigateToReleaseIndex(): void {
    this._router.navigate([
      this._router.url + '/' + this.projectWithCustomer._id + '/release',
    ]);
  }

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }

  /**
   * Emit a event to open a dialog to duplicate the entity.
   */
  openDuplicateDialog(): void {
    this.duplicateEntityEvent.emit(this.projectWithCustomer);
  }
}
