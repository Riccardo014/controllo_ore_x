import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ApiPaginatedResponse, ReleaseReadDto } from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-release-table',
  templateUrl: './release-table.component.html',
  styleUrls: ['./release-table.component.scss'],
})
export class ReleaseTableComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Input() projectId!: string;

  @Input() isNewReleaseCreated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  @Output() onReleaseUpdatedEvent: EventEmitter<void> =
    new EventEmitter<void>();

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  releases: ReleaseReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(protected _releaseDataService: ReleaseDataService) {}

  ngOnInit(): void {
    if (!this.projectId) {
      throw new Error('projectId is required');
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
    this.subscriptionsList.push(
      this._onNewReleaseCreated(),
      this._fetchSetReleases(),
    );
  }

  onReleaseUpdated(): void {
    this.subscriptionsList.push(this._fetchSetReleases());
    this.onReleaseUpdatedEvent.emit();
  }

  private _onNewReleaseCreated(): Subscription {
    return this.isNewReleaseCreated.subscribe({
      next: () => {
        this.subscriptionsList.push(this._fetchSetReleases());
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }

  private _fetchSetReleases(): Subscription {
    this.isLoading.next(true);
    return this._releaseDataService
      .getMany({
        where: { projectId: this.projectId },
        order: { version: 'DESC' },
      })
      .subscribe({
        next: (releases: ApiPaginatedResponse<ReleaseReadDto>) => {
          this.releases = releases.data;
          this.isLoading.next(false);
        },
        error: (error: any) => {
          throw new Error(error);
        },
      });
  }
}
