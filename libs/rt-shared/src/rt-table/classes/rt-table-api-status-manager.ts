import { FindBoostedOptions } from '@api-interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';
import { rtTableColumnValue } from '../lib/rt-table-column-value';
import { BaseDataService } from './data-service';
import { RtTableStatusHandler } from './rt-table-status-handler';

export class RtTableApiStatusManager<
  T,
  CreateT,
  UpdateT,
> extends RtTableStatusHandler<T> {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  #currentCallSubscription?: Subscription;

  currentError: any;

  constructor(private _dataService: BaseDataService<T, CreateT, UpdateT>) {
    super();
  }

  override fetchData(): void {
    if (this.isLoading.value) {
      this.#currentCallSubscription?.unsubscribe();
    } else {
      this.isLoading.next(true);
    }

    this.#currentCallSubscription = this._dataService
      .getMany(this.apiRequestPayload)
      .subscribe({
        next: (apiResult) => {
          this.data = apiResult.data;
          this.currentStatus.pagination = apiResult.pagination;
        },
        error: (err) => {
          this.currentError = err;
        },
        complete: () => {
          this.isLoading.next(false);
        },
      });
  }

  get apiRequestPayload(): FindBoostedOptions {
    if (!this.tableConfiguration) {
      throw new Error('Unprocessable Request. No Table configuration found');
    }

    return {
      select: this.tableConfiguration.select,
      relations: this.tableConfiguration.relations,
      fullSearchCols: this.tableConfiguration.fullSearchCols,
      where: this._buildWhereOption(),
      pagination: this.currentStatus.pagination,
      fulltextSearch: this.currentStatus.fulltextSearch,
      order: this.currentStatus.order,
    };
  }

  private _buildWhereOption(): void {
    let where: any;
    if (Array.isArray(this.currentStatus.where)) {
      where = this.currentStatus.where;
      for (let i: number = 0; i < where.length; i++) {
        where[i] = {
          ...where[i],
          ...(this.tableConfiguration?.hiddenFilters || {}),
        };
      }
      if (
        where.length === 0 &&
        Object.keys(this.tableConfiguration?.hiddenFilters || {}).length > 0
      ) {
        where.push({
          ...(this.tableConfiguration?.hiddenFilters || {}),
        });
      }
    } else {
      where = {
        ...this.currentStatus.where,
        ...(this.tableConfiguration?.hiddenFilters || {}),
      };
    }
    return where;
  }

  exportCsvData(): void {
    this.isLoading.next(true);
    this._dataService
      .getMany({
        ...this.apiRequestPayload,
        pagination: false,
      })
      .subscribe((res) => {
        this.isLoading.next(false);

        const results: any = [];
        results.push(
          this.tableConfiguration!.columns.map((column) => column.title),
        );
        for (const row of res.data) {
          const csvRow: any = [];
          for (const column of this.tableConfiguration!.columns) {
            csvRow.push(rtTableColumnValue(column, row));
          }
          results.push(csvRow);
        }
      });
  }
}
