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
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'lib-rt-filter',
  templateUrl: './rt-filter.component.html',
  styleUrls: ['./rt-filter.component.scss'],
})
export class RtFilterComponent
  implements OnInit, OnDestroy
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
  destroy$: Subject<boolean> = new Subject();

  constructor(private _fb: FormBuilder) {
    this.currentFilters = this._fb.array([]);
    this.mockForm = this._fb.group({
      searchId: [],
    });
  }

  get currentFiltersControls(): FormGroup[] {
    return this.currentFilters.controls as FormGroup[];
  }

  ngOnInit(): void {
    this._handleListenSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
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

  private _handleListenSubscription(): void {
    this.currentFilters.valueChanges
      .pipe(takeUntil(this.destroy$),  debounceTime(800))
      .subscribe((filterValues) => {
        if (this.currentFilters.valid) {
          this.filtersChangedEvent.emit(this._buildFilters(filterValues));
        }
      });
  }
}
