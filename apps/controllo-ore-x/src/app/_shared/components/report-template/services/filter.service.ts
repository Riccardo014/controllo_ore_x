import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COX_FILTER } from '@api-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  dataForFilters: BehaviorSubject<
    {
      list: any[];
      singleLabel: string;
      multiLabel: string;
      fieldName: COX_FILTER;
      formControl: FormControl;
    }[]
  > = new BehaviorSubject<
    {
      list: any[];
      singleLabel: string;
      multiLabel: string;
      fieldName: COX_FILTER;
      formControl: FormControl;
    }[]
  >([]);

  dataForFiltersObservable: Observable<
    {
      list: any[];
      singleLabel: string;
      multiLabel: string;
      fieldName: COX_FILTER;
      formControl: FormControl;
    }[]
  > = this.dataForFilters.asObservable();

  changeDataForFilters(value: any[]): void {
    this.dataForFilters.next(value);
  }

  changeDataForSingleFilter(value: any): void {
    const dataForFilters = this.dataForFilters.value;
    dataForFilters.forEach((dataForFilter: any) => {
      if (dataForFilter.fieldName === value.fieldName) {
        dataForFilter.list = value.list;
      }
    });
    this.dataForFilters.next(dataForFilters);
    console.log(this.dataForFilters.value[0].formControl.value);
  }
}
