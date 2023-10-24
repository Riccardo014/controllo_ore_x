import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HoursTagReadDto } from '@api-interfaces';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-activity-card',
  templateUrl: './project-activity-card.component.html',
  styleUrls: ['./project-activity-card.component.scss'],
})
export class ProjectActivityCardComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  tag?: HoursTagReadDto;

  @Input() tagWithHours!: {
    hoursTagId: string;
    hours: number;
  };

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _hoursTagDataService: HoursTagDataService) {}

  ngOnInit(): void {
    if (!this.tagWithHours) {
      throw new Error('tagWithHours is required');
    }
    if (typeof this.tagWithHours !== 'object') {
      throw new Error('tagWithHours must be a object');
    }
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._fetchSetTag(this.tagWithHours.hoursTagId),
    );
  }

  private _fetchSetTag(tagId: string): Subscription {
    return this._hoursTagDataService
      .getOne(tagId)
      .subscribe((hoursTag: any) => {
        this.tag = hoursTag;
      });
  }
}
