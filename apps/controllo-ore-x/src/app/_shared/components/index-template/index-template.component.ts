import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { Subscription } from 'rxjs';

/**
 * Template of a index page with an header and a body
 */
@Component({
  selector: 'controllo-ore-x-index-template',
  templateUrl: './index-template.component.html',
  styleUrls: ['./index-template.component.scss'],
})
export class IndexTemplateComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  /**
   * Page to be displayed
   */
  @Input() page!: IndexPage<any, any, any>;

  /**
   * If true, the page will have a menu with options
   */
  @Input() hasMenuOptions: boolean = false;

  /**
   * If true, the page will have a calendar
   */
  @Input() hasCalendar: boolean = false;

  /**
   * If true, the page will have a range calendar
   */
  @Input() hasRangeCalendar: boolean = false;

  /**
   * If true, the page will have a button to export the data in csv format
   */
  @Input() hasExportCsv: boolean = true;

  /**
   * If true, the page will have a table to display the data
   */
  @Input() isPageWithTable: boolean = true;

  /**
   * If true, the page will have a header
   */
  @Input() isCompletePage: boolean = true;

  /**
   * The function to be called when the user clicks on the create button
   */
  @Input() createFn?: () => void | Promise<void>;

  /**
   * The function to be called when the user clicks on the edit button
   */
  @Input() editFn?: (entity: any) => void | Promise<void>;

  /**
   * If true, the create button will be hidden
   */
  @Input() shouldHideCreateButton: boolean = false;

  /**
   * If true, the edit button in the table line will be shown
   */
  @Input() isEditAvailable: boolean = false;

  /**
   * The icon of the header button
   */
  @Input() buttonIcon: string = 'Icon';

  /**
   * The text of the header button
   */
  @Input() buttonText: string = 'Button txt';

  /**
   * The function to be called when the user clicks on the header button, that should open a dialog or redirect to an upsert page
   */
  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output() openCreateDialogEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  private _isLoading: boolean = true;
  private _isFirstLoadDone: boolean = false;

  constructor(private _loadingService: RtLoadingService) {}

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this.page.isLoading.subscribe((isLoading) => {
        this._isLoading = isLoading;
        this._setLoadingParameters();
      }),
      this.page.isFirstLoadDone.subscribe((isFirstLoadDone) => {
        this._isFirstLoadDone = isFirstLoadDone;
        this._setLoadingParameters();
      }),
    );
  }

  openDialogFn(entity: any): void {
    this.openDialogEvent.emit(entity);
  }

  openCreateDialogFn(): void {
    this.openCreateDialogEvent.emit(true);
  }

  private _setLoadingParameters(): void {
    if (this._isLoading) {
      this._isFirstLoadDone
        ? this._loadingService.showLoading()
        : this._loadingService.showLoadingBlocking();
    } else {
      this._loadingService.hideLoading();
      this._loadingService.hideLoadingBlocking();
    }
  }
}
