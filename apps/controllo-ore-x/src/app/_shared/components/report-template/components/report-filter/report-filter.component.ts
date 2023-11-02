import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FIND_BOOSTED_FN, FindBoostedWhereOption } from '@api-interfaces';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { DataForFilter } from 'libs/utils';
import { Subscription } from 'rxjs';
import { FilterService } from '../../services/filter.service';
@Component({
  selector: 'controllo-ore-x-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Output() filtersEvent: EventEmitter<FindBoostedWhereOption[]> =
    new EventEmitter<FindBoostedWhereOption[]>();

  dataForFilters: DataForFilter[] = [];

  areFiltersActive: boolean = false;

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _filterService: FilterService) {}

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this._filterService.dataForFiltersObservable.subscribe(
        (dataForFilters: DataForFilter[]) => {
          this.dataForFilters = dataForFilters;
          this._areAnyFiltersActive();
        },
      ),
    );
  }

  remove(filter: any, element: string): void {
    this.dataForFilters.forEach((dataForFilter: DataForFilter) => {
      if (dataForFilter.fieldName == filter.fieldName) {
        const index = filter.formControl.value.indexOf(element);
        if (index >= 0) {
          const newValue = filter.formControl.value;
          newValue.splice(index, 1);
          dataForFilter.formControl.setValue(newValue);
          this._areAnyFiltersActive();
          this.applyFn();
        }
      }
    });
  }

  resetFn(): void {
    this.dataForFilters.forEach((dataForFilter: DataForFilter) => {
      dataForFilter.formControl.setValue([]);
    });
    this.areFiltersActive = false;
    this.filtersEvent.emit([]);
  }

  applyFn(): void {
    this.filtersEvent.emit([this._buildFilters()]);
  }

  private _areAnyFiltersActive(): void {
    this.areFiltersActive = false;
    this.dataForFilters.forEach((dataForFilter: DataForFilter) => {
      this.areFiltersActive =
        this.areFiltersActive || !!dataForFilter.formControl.value?.length;
    });
  }

  private _createNestedStructure(dbColumnsFlat: string[], args: string[]): any {
    if (dbColumnsFlat.length === 0) {
      return {
        _id: {
          _fn: FIND_BOOSTED_FN.STRING_IN,
          args: args,
        },
      };
    }

    const dbColumn = dbColumnsFlat[0];
    const restDbColumns = dbColumnsFlat.slice(1);

    return {
      [dbColumn]: this._createNestedStructure(restDbColumns, args),
    };
  }

  private _buildFilters(): FindBoostedWhereOption {
    const filterValue: FindBoostedWhereOption = {};
    for (const dataForFilter of this.dataForFilters) {
      if (!dataForFilter.formControl.value?.length) {
        continue;
      }
      const args: string[] = [];
      for (const entityToFilter of dataForFilter.formControl.value) {
        args.push(entityToFilter._id);
      }

      const dbColumnsPointNested: string = dataForFilter.fieldName;
      const dbColumnsFlat: string[] = dbColumnsPointNested.split('.');
      const firstDbColumn = dbColumnsFlat.splice(0, 1).toString();

      filterValue[firstDbColumn] = this._createNestedStructure(
        dbColumnsFlat,
        args,
      );
    }

    return filterValue;
  }
}
