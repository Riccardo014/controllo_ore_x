import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { COX_FILTER, FindBoostedWhereOption } from '@api-interfaces';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { CoxFilter } from 'libs/utils';
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
  @Output() filtersEmitter: EventEmitter<FindBoostedWhereOption[]> =
    new EventEmitter<FindBoostedWhereOption[]>();

  dataForFilters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
  }[] = [];

  filters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
    formControl: FormControl;
  }[] = [];

  activeFilters: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
    formControl: FormControl;
  }[] = [];

  areFiltersActive: boolean = false;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _filterService: FilterService) {}

  ngOnInit(): void {
    console.log(this.dataForFilters);
    this.loadDataForFilters();

    this.filters.forEach((filter) => {
      this.activeFilters.push({
        list: [],
        singleLabel: filter.singleLabel,
        multiLabel: filter.multiLabel,
        fieldName: filter.fieldName,
        formControl: filter.formControl,
      });
    });

    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._filterService.dataForFiltersObservable.subscribe(
        (dataForFilters) => {
          this.dataForFilters = dataForFilters;
          this.loadDataForFilters();
        },
      ),
    );
  }

  loadDataForFilters(): void {
    this.dataForFilters.forEach((dataForFilter) => {
      let isPresent: boolean = false;
      this.filters.forEach((filter) => {
        if (filter.fieldName == dataForFilter.fieldName) {
          isPresent = true;
        }
      });
      if (isPresent) {
        return;
      }
      this.filters.push({
        list: dataForFilter.list,
        singleLabel: dataForFilter.singleLabel,
        multiLabel: dataForFilter.multiLabel,
        fieldName: dataForFilter.fieldName,
        formControl: new FormControl(),
      });
    });
  }

  formEmitter(filter: any, newValue: any[]): void {
    const selectedFilter: CoxFilter = {
      fieldName: filter.fieldName,
      list: newValue,
    };

    //update the active filters
    this.activeFilters.forEach((activeFilter) => {
      if (activeFilter.fieldName == selectedFilter.fieldName) {
        activeFilter.list = selectedFilter.list;
      }
    });

    //update areFiltersActive
    this.areFiltersActive = false;
    this.activeFilters.forEach((activeFilter) => {
      this.areFiltersActive =
        this.areFiltersActive || !!activeFilter.list.length;
    });
  }

  remove(filter: CoxFilter, element: string): void {
    this.activeFilters.forEach((activeFilter) => {
      if (activeFilter.fieldName == filter.fieldName) {
        const index = filter.list.indexOf(element);
        if (index >= 0) {
          filter.list.splice(index, 1);
          activeFilter.formControl.setValue(filter.list);
        }
      }
    });
  }

  resetFn(): void {
    this.activeFilters.forEach((activeFilter) => {
      activeFilter.list = [];
      activeFilter.formControl.setValue([]);
    });
    this.areFiltersActive = false;
    this.filtersEmitter.emit([]);
  }

  applyFn(): void {
    const selectedFilters: CoxFilter[] = [];
    this.activeFilters.forEach((activeFilter) => {
      if (activeFilter.list.length) {
        selectedFilters.push({
          fieldName: activeFilter.fieldName,
          list: activeFilter.list,
        });
      }
    });

    this.filtersEmitter.emit(selectedFilters);
  }
}
