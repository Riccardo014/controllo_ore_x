import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { UpsertPage } from '@shared/classes/upsert-page.class';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { Subscription } from 'rxjs';

/**
 * Template of a upsert page with an header and a body
 */
@Component({
  selector: 'controllo-ore-x-upsert-template',
  templateUrl: './upsert-template.component.html',
  styleUrls: ['./upsert-template.component.scss'],
})
export class UpsertTemplateComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  /**
   * If true, the page will hide the options section
   */
  @Input() isMoreOptionHidden: boolean = true;

  /**
   * Page to be displayed
   */
  @Input() page!: UpsertPage<any, any, any>;

  /**
   * If true, the page is loading
   */
  @Input() isLoading: boolean = false;

  /**
   * If true, the page has an error
   */
  @Input() isError: boolean = false;

  /**
   * The title of the page that can change dynamically
   */
  @Input() dynamicTitle?: string;

  /**
   * The label of the chip
   */
  @Input() chipLabel?: string;

  /**
   * If true, the breadcrumb will be hidden
   */
  @Input() isBreadcrumbHidden: boolean = true;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  private _isLoading: boolean = false;
  private _isFirstLoadDone: boolean = false;

  constructor(private _loadingSvc: RtLoadingService) {}

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this.page.isLoading.pipe().subscribe((isLoading) => {
        this._isLoading = isLoading;
        this._setLoadingParameters();
      }),
      this.page.isFirstLoadDone.pipe().subscribe((isFirstLoadDone) => {
        this._isFirstLoadDone = isFirstLoadDone;
        this._setLoadingParameters();
      }),
    );
  }

  private _setLoadingParameters(): void {
    if (this._isLoading) {
      this._isFirstLoadDone
        ? this._loadingSvc.showLoading()
        : this._loadingSvc.showLoadingBlocking();
    } else {
      this._loadingSvc.hideLoading();
      this._loadingSvc.hideLoadingBlocking();
    }
  }
}
