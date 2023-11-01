import { FindBoostedOptions } from '@api-interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';
import { rtTableColumnValue } from '../lib/rt-table-column-value';
import { BaseDataService } from './base-data-service.class';
import { RtTableStatusHandler } from './rt-table-status-handler';

export class RtTableApiStatusManager<
  T,
  CreateT,
  UpdateT,
> extends RtTableStatusHandler<T> {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  #fetchDataSubscription?: Subscription;

  currentError: Error | null = null;

  constructor(private _dataService: BaseDataService<T, CreateT, UpdateT>) {
    super();
  }

  /**
   * Update the data of the table from the API.
   */
  override fetchData(): void {
    if (this.isLoading.value) {
      this.#fetchDataSubscription?.unsubscribe();
    } else {
      this.isLoading.next(true);
    }

    this.#fetchDataSubscription = this._dataService
      .getMany(this.apiRequestPayload)
      .subscribe({
        next: (apiResult) => {
          this.data = apiResult.data;
          this.status.pagination = apiResult.pagination;
        },
        error: (err: Error) => {
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
      pagination: this.tableConfiguration.pagination?.disabled
        ? false
        : this.status.pagination,
      fulltextSearch: this.status.fulltextSearch,
      order: this.status.order,
    };
  }

  //FIXME: refactor to have better readability and review logics
  private _buildWhereOption(): void {
    let where: any;
    if (Array.isArray(this.status.where)) {
      where = this.status.where;
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
        ...this.status.where,
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

        const results: string[][] = [];

        //Build the columns of the csv file.
        results.push(
          this.tableConfiguration!.columns.map((column) => column.title),
        );
        for (const row of res.data) {
          const csvRow: string[] = [];

          //Populate the results with data, by building the rows and pushing them to result.
          for (const column of this.tableConfiguration!.columns) {
            csvRow.push(rtTableColumnValue(column, row));
          }
          results.push(csvRow);
        }
      });
  }
}
