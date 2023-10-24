import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  CustomerCreateDto,
  CustomerReadDto,
  CustomerUpdateDto,
  INDEX_CONFIGURATION_KEY,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { IndexConfigurationDataService } from '@app/_core/services/index-configuration.data-service';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { BehaviorSubject } from 'rxjs';
import { CustomerDialog } from '../dialogs/customer-dialog/customer.dialog';

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
  titleIcon: string | null = 'bakery_dining';
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

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected _configurationService: IndexConfigurationDataService,
    protected _dataService: CustomerDataService,
    protected _loadingService: RtLoadingService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
  ) {
    super();
  }

  openDialogFn($event: CustomerReadDto): void {
    this._rtDialogService
      .open(CustomerDialog, {
        width: '600px',
        maxWidth: '600px',
        data: $event,
      })
      .subscribe();
  }

  createFn(): void {
    this._rtDialogService
      .open(CustomerDialog, {
        width: '600px',
        maxWidth: '600px',
      })
      .subscribe();
  }
}
