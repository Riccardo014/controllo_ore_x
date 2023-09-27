import { Directive, OnInit } from '@angular/core';
import { INDEX_CONFIGURATION_KEY, TableConfiguration } from '@api-interfaces';
import { RtTableApiStatusManager } from '@controllo-ore-x/rt-shared';
import { IndexConfigurationDataService } from '@core/services/index-configuration-data.service';
import { BehaviorSubject } from 'rxjs';

@Directive()
export abstract class BoIndexPage<T, CreateT, UpdateT> implements OnInit {
  isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  abstract title: string;
  // abstract titleIcon: string | null;
  abstract CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY;

  configuration!: TableConfiguration;

  indexTableHandler!: RtTableApiStatusManager<T, CreateT, UpdateT>;

  // todo set tipe of data setting (see codi )
  protected abstract _dataService: any;
  protected abstract _configurationService: IndexConfigurationDataService;

  ngOnInit(): void {
    this.indexTableHandler = new RtTableApiStatusManager<T, CreateT, UpdateT>(this._dataService);
    this._firstLoad();

    this.indexTableHandler.isLoading.subscribe((r) => {
      this.isFirstLoadDone.next(true);
      this.isLoading.next(r);
    });
  }

  private _firstLoad(): void {
    this._configurationService.getConfiguration(this.CONFIGURATION_KEY).subscribe((configuration) => {
      this.configuration = configuration.data.configuration;
      this.indexTableHandler.tableConfiguration = this.configuration;
      this.indexTableHandler.fetchData();
      this.isFirstLoadDone.next(true);
    });
  }
}
