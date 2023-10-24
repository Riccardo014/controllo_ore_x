import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FIND_BOOSTED_FN, FindBoostedWhereOption } from '@api-interfaces';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from 'apps/controllo-ore-x/src/app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface FilterTypeFunction {
  fn: FIND_BOOSTED_FN;
  label: string;
}

@Component({
  selector: 'lib-rt-filter',
  templateUrl: './rt-filter.component.html',
  styleUrls: ['./rt-filter.component.scss'],
})
export class RtFilterComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  areFiltersOpen: boolean = false;
  currentFilters: FormArray;
  @Output() filtersChangedEvent: EventEmitter<FindBoostedWhereOption[]> =
    new EventEmitter<FindBoostedWhereOption[]>();
  @Input() filterOptions: FindBoostedWhereOption[] = [];
  FIND_BOOSTED_FN: typeof FIND_BOOSTED_FN = FIND_BOOSTED_FN;

  @Output() openFilterEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  mockForm: FormGroup;

  currentFilterType: 'AND' | 'OR' = 'AND';

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _fb: FormBuilder) {
    this.currentFilters = this._fb.array([]);
    this.mockForm = this._fb.group({
      searchId: [],
    });
  }

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this.currentFilters.valueChanges
        .pipe(debounceTime(800))
        .subscribe((filterValues) => {
          if (this.currentFilters.valid) {
            this.filtersChangedEvent.emit(this._buildFilters(filterValues));
          }
        }),
    );
  }

  get currentFiltersControls(): FormGroup[] {
    return this.currentFilters.controls as FormGroup[];
  }

  toggleFilter(): void {
    this.openFilterEvent.emit(true);
    this.areFiltersOpen = !this.areFiltersOpen;
  }

  clearFilters(): void {
    this.currentFilters.clear();
    this.filtersChangedEvent.emit([]);
    this.areFiltersOpen = false;
  }

  private _buildFilters(values: any[]): FindBoostedWhereOption[] {
    if (this.currentFilterType === 'AND') {
      const filterValue: FindBoostedWhereOption = {};
      for (const filter of values) {
        filterValue[filter.filter.field] = {
          _fn: filter.fn,
          args: filter.secondaryValue
            ? [filter.value, filter.secondaryValue]
            : [filter.value],
        };
      }
      return [filterValue];
    } else {
      const filterValues: FindBoostedWhereOption[] = [];
      for (const filter of values) {
        const filterToAdd: FindBoostedWhereOption = {};
        filterToAdd[filter.filter.field] = {
          _fn: filter.fn,
          args: filter.secondaryValue
            ? [filter.value, filter.secondaryValue]
            : [filter.value],
        };
        filterValues.push(filterToAdd);
      }
      return filterValues;
    }
  }
}
