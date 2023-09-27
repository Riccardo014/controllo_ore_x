import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FIND_BOOSTED_FN, FindBoostedWhereOption } from '@api-interfaces';
import { debounceTime } from 'rxjs/operators';

interface FilterTypeFunction {
  fn: FIND_BOOSTED_FN;
  label: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lib-rt-filter',
  templateUrl: './rt-filter.component.html',
  styleUrls: ['./rt-filter.component.scss'],
})
export class RtFilterComponent {
  areFiltersOpen: boolean = false;
  currentFilters: FormArray;
  @Output() filtersChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() filterOptions: any[] = [];
  FIND_BOOSTED_FN: typeof FIND_BOOSTED_FN = FIND_BOOSTED_FN;

  @Output() openFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  mockForm!: FormGroup;

  currentFilterType: 'AND' | 'OR' = 'AND';

  constructor(private _fb: FormBuilder) {
    this.currentFilters = this._fb.array([]);
    this.currentFilters.valueChanges.pipe(debounceTime(1300)).subscribe((filterValues) => {
      if (this.currentFilters.valid) {
        this.filtersChanged.emit(this._buildFilters(filterValues));
      }
    });
    this.mockForm = this._fb.group({
      searchId: [],
    });
  }

  get currentFiltersControls(): FormGroup[] {
    return this.currentFilters.controls as FormGroup[];
  }

  toggleFilter(): void {
    this.openFilter.emit(true);
    this.areFiltersOpen = !this.areFiltersOpen;
  }

  clearFilters(): void {
    this.currentFilters.clear();
    this.filtersChanged.emit([]);
    this.areFiltersOpen = false;
  }

  private _buildFilters(values: any[]): FindBoostedWhereOption[] {
    if (this.currentFilterType === 'AND') {
      const filterValue: FindBoostedWhereOption = {};
      for (const filter of values) {
        filterValue[filter.filter.field] = {
          _fn: filter.fn,
          args: filter.secondaryValue
            ? [
                filter.value,
                filter.secondaryValue,
              ]
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
            ? [
                filter.value,
                filter.secondaryValue,
              ]
            : [filter.value],
        };
        filterValues.push(filterToAdd);
      }
      return filterValues;
    }
  }
}
