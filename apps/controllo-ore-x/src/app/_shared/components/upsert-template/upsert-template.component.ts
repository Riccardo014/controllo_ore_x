import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UpsertPage } from '@shared/classes/upsert-page.class';
import { RtLoadingService } from 'libs/rt-shared/src/rt-loading/services/rt-loading.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-upsert-template',
  templateUrl: './upsert-template.component.html',
  styleUrls: ['./upsert-template.component.scss'],
})
export class UpsertTemplateComponent implements OnInit, OnDestroy {
  @Input() isMoreOptionHidden: boolean = true;
  @Input() page!: UpsertPage<any, any, any>;
  @Input() isLoading: boolean = false;

  @Input() isError: boolean = false;

  @Input() dynamicTitle?: string;
  @Input() chipLabel?: string;
  @Input() isBreadcrumbHidden: boolean = true;

  private _isLoading: boolean = false;
  private _isFirstLoadDone: boolean = false;

  destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _loadingSvc: RtLoadingService) {}

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
        ? this._loadingSvc.showLoading()
        : this._loadingSvc.showLoadingBlocking();
    } else {
      this._loadingSvc.hideLoading();
      this._loadingSvc.hideLoadingBlocking();
    }
  }
}
