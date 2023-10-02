import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  CustomerCreateDto,
  CustomerReadDto,
  CustomerUpdateDto,
  INDEX_CONFIGURATION_KEY,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer-data.service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { IndexConfigurationDataService } from '@core/services/index-configuration-data.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject, ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-customer-index',
  templateUrl: './customer-index.page.html',
  styleUrls: ['./customer-index.page.scss'],
})
export class CustomerIndexPage extends IndexPage<
  CustomerReadDto,
  CustomerCreateDto,
  CustomerUpdateDto
> {
  titleIcon: string | null = 'workspaces';
  title: string = 'Clienti';
  pageTitle = 'Clienti';
  buttonIcon = 'bakery_dining';
  buttonText = 'Nuovo Cliente';

  CONFIGURATION_KEY: INDEX_CONFIGURATION_KEY = INDEX_CONFIGURATION_KEY.CUSTOMER;
  isItLoading: boolean = false;
  _isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  hasErrors: boolean = false;
  isEditAvailable: boolean = false;

  destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: CustomerDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
  ) {
    super();

    this.isLoading.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this.isItLoading = false;
    });
    this.isFirstLoadDone.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this._isFirstLoadDone = new BehaviorSubject<boolean>(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  openConfirmationDelete(customer: CustomerReadDto): void {
    console.log('openConfirmationDelete', customer);
  }

  openDialogFn($event: any): void {
    this.openDialog.emit($event);
    this._router.navigate([this._router.url + '/' + $event._id]);
  }
}
