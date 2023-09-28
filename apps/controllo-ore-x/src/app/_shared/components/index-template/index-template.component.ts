import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '@app/_shared/classes/index-page.class';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-index-template',
  templateUrl: './index-template.component.html',
  styleUrls: ['./index-template.component.scss'],
})
export class IndexTemplateComponent implements OnInit, OnDestroy {
  @Input() page!: IndexPage<any, any, any>;
  @Input() hasMenuOptions: boolean = false;
  @Input() hasExportCsv: boolean = true;
  @Input() createFn?: () => void | Promise<void>;
  @Input() editFn?: (entity: any) => void | Promise<void>;
  @Input() shouldHideCreateButton: boolean = false;
  @Input() isEditAvailable: boolean = false;
  @Input() buttonIcon: string = 'Icon';
  @Input() buttonText: string = 'Button txt';

  private _isLoading: boolean = true;
  private _isFirstLoadDone: boolean = false;

  destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _loadingService: RtLoadingService) {}

  ngOnInit(): void {
    this.page.isLoading.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this._isLoading = r;
      this._setLoadingParameters();
    });
    this.page.isFirstLoadDone.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this._isFirstLoadDone = r;
      this._setLoadingParameters();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
