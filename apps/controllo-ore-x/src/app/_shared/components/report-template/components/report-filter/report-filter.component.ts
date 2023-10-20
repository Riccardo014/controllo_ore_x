import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  COX_FILTER,
  FIND_BOOSTED_FN,
  FindBoostedWhereOption,
} from '@api-interfaces';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
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
    formControl: FormControl;
  }[] = [];

  areFiltersActive: boolean = false;

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(private _filterService: FilterService) {}

  ngOnInit(): void {
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
          this.areAnyFiltersActive();
        },
      ),
    );
  }

  areAnyFiltersActive(): void {
    this.areFiltersActive = false;
    this.dataForFilters.forEach((dataForFilter) => {
      this.areFiltersActive =
        this.areFiltersActive || !!dataForFilter.formControl.value?.length;
    });
  }

  remove(filter: any, element: string): void {
    this.dataForFilters.forEach((dataForFilter) => {
      if (dataForFilter.fieldName == filter.fieldName) {
        const index = filter.formControl.value.indexOf(element);
        if (index >= 0) {
          const newValue = filter.formControl.value;
          newValue.splice(index, 1);
          dataForFilter.formControl.setValue(newValue);
          this.areAnyFiltersActive();
        }
      }
    });
  }

  resetFn(): void {
    this.dataForFilters.forEach((dataForFilter) => {
      dataForFilter.formControl.setValue([]);
    });
    this.areFiltersActive = false;
    this.filtersEmitter.emit([]);
  }

  applyFn(): void {
    this.filtersEmitter.emit([this._buildFilters()]);
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

      filterValue[firstDbColumn] = this._createNestedStructure(dbColumnsFlat, args);
    }

    console.log('filterValue', filterValue);
    return filterValue;

    //   let copyCurrentNestLevel: any = {};
    //   // let lastLevel: any = {};
    //   for (let index = 0; index < dbColumnsFlat.length; index++) {
    //     const dbColumn = dbColumnsFlat[index];

    //     // livello intermedio devo creare lo scaffold con il livello precedente
    //     if (index > 0) {
    //       // const previousLevelColumn = dbColumnsFlat[index - 1];

    //       // copyCurrentNestLevel[previousLevelColumn][dbColumn] = {};
    //       // lastLevel = copyCurrentNestLevel[previousLevelColumn][dbColumn];

    //       // ultimo livello  metto gli args e fn
    //       // if(index === dbColumnsFlat.length - 1) {
    //       //   _id: {
    //       //     _fn: FIND_BOOSTED_FN.STRING_IN,
    //       //     args: args,
    //       //   },
    //       // }
    //       console.log('dbColumnsFlat', dbColumnsFlat);
    //       console.log('dbColumnPreviousLevel', dbColumnPreviousLevel);
    //       console.log('dbColumn', dbColumn);
    //       copyCurrentNestLevel[dbColumnPreviousLevel][dbColumn] = {};
    //       dbColumnPreviousLevel =
    //         copyCurrentNestLevel[dbColumnPreviousLevel][dbColumn];
    //       continue;
    //     }

    //     // se è solo un livello creo l'oggetto da restituire con  gli args e _fn
    //     if (dbColumnsFlat.length === 1) {
    //       filterValue[dbColumn] = {
    //         _id: {
    //           _fn: FIND_BOOSTED_FN.STRING_IN,
    //           args: args,
    //         },
    //       };
    //       continue;
    //     }

    //     //se sono al primo livello di un oggetto a più livelli creo lo scaffold con il primo livello
    //     if (index === 0) {
    //       console.log('dbColumn', dbColumn);
    //       filterValue[dbColumn] = {};
    //       console.log('filterValue', filterValue);
    //       dbColumnPreviousLevel = filterValue[dbColumn];
    //     }

    //     // copyCurrentNestLevel[dbColumn] = {};
    //   }

    //   // filterValue[dataForFilter.fieldName] = {
    //   //   _id: {
    //   //     _fn: FIND_BOOSTED_FN.STRING_IN,
    //   //     args: args,
    //   //   },
    //   // };
    // }

  }
}
