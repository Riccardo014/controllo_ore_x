import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COX_FILTER } from '@api-interfaces';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'controllo-ore-x-report-single-filter',
  templateUrl: './report-single-filter.component.html',
  styleUrls: ['./report-single-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReportSingleFilterComponent),
      multi: true,
    },
  ],
})
export class ReportSingleFilterComponent
  implements OnInit, OnDestroy, SubscriptionsLifecycle
{
  @Output() changeEvent: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Input() fieldName!: COX_FILTER;

  dataForFilter!: {
    list: any[];
    singleLabel: string;
    multiLabel: string;
    fieldName: COX_FILTER;
    formControl: FormControl;
  };

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _filterService: FilterService) {}

  ngOnInit(): void {
    this.setSubscriptions();

    this.dataForFilter.formControl.valueChanges.subscribe((value) => {
      this._filterService.changeDataForSingleFilter(this.dataForFilter);
      // this.change.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(
      this._filterService.dataForFiltersObservable.subscribe(
        (dataForFilters: any[]) => {
          dataForFilters.forEach((dataForFilter) => {
            if (dataForFilter.fieldName === this.fieldName) {
              this.dataForFilter = dataForFilter;
            }
          });
        },
      ),
    );
  }

  getLabel(length: number | undefined): string {
    if (!length) {
      return '';
    }
    if (length === 1) {
      return '1 ' + this.dataForFilter.singleLabel;
    } else {
      return (length || 0) + ' ' + this.dataForFilter.multiLabel;
    }
  }

  value: string = '';
  writeValue(value: string): void {
    this.value = value ? value : '';
  }
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
