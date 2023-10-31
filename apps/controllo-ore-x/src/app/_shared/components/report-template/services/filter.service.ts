import { Injectable } from '@angular/core';
import { DataForFilter } from 'libs/utils';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  dataForFilters: BehaviorSubject<DataForFilter[]> = new BehaviorSubject<
    DataForFilter[]
  >([]);

  dataForFiltersObservable: Observable<DataForFilter[]> =
    this.dataForFilters.asObservable();

  changeDataForFilters(value: DataForFilter[]): void {
    this.dataForFilters.next(value);
  }

  changeDataForSingleFilter(value: DataForFilter): void {
    const dataForFilters = this.dataForFilters.value;
    dataForFilters.forEach((dataForFilter: any) => {
      if (dataForFilter.fieldName === value.fieldName) {
        dataForFilter.formControl.value = value.formControl.value;
      }
    });
    this.dataForFilters.next(dataForFilters);
  }
}
