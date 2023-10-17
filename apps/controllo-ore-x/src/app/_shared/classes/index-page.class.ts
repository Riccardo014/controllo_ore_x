import { Directive, OnDestroy, OnInit } from '@angular/core';
import { INDEX_CONFIGURATION_KEY, TableConfiguration } from '@api-interfaces';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  BaseDataService,
  RtTableApiStatusManager,
} from '@controllo-ore-x/rt-shared';
import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * It's a helper class to manage the index pages
 */
@Directive()
export abstract class IndexPage<T, CreateT, UpdateT>
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  subscriptionsList: Subscription[] = [];
  isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isPageWithTable: boolean = true;
  isTableTopbarVisible: boolean = true;
  isTableHeaderVisible: boolean = true;
  isCompletePage: boolean = true;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  configuration!: TableConfiguration;
  indexTableHandler!: RtTableApiStatusManager<T, CreateT, UpdateT>;

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  abstract title: string;
  abstract titleIcon: string | null;
  abstract CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY;
  protected abstract _dataService: BaseDataService<T, CreateT, UpdateT>;
  protected abstract _configurationService: IndexConfigurationDataService;

  ngOnInit(): void {
    this.indexTableHandler = new RtTableApiStatusManager<T, CreateT, UpdateT>(
      this._dataService,
    );
    if (!this.indexTableHandler) {
      throw new Error('Ititialization of indexTableHandler failed');
    }

    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._firstLoad(),
      this.indexTableHandler.isLoading.subscribe((r) => {
        this.isFirstLoadDone.next(true);
        this.isLoading.next(r);
      }),
    );
  }

  private _firstLoad(): Subscription {
    return this._configurationService
      .getConfiguration(this.CONFIGURATION_KEY)
      .subscribe((data) => {
        console.log(data);
        this.configuration = data.configuration;
        this.indexTableHandler.tableConfiguration = this.configuration;
        this.indexTableHandler.fetchData();
        this.isFirstLoadDone.next(true);
      });
  }
}
