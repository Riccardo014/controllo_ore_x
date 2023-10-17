import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoxFilter } from 'libs/utils';

@Component({
  selector: 'controllo-ore-x-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent {
  @Output() filtersEmitter: EventEmitter<CoxFilter[]> = new EventEmitter<
    CoxFilter[]
  >();

  filters: {
    field: string;
    formControl: FormControl;
    list: any[];
  }[] = [];

  constructor() {
    this.filters.push({
      field: 'customers',
      formControl: new FormControl(''),
      list: [
        'Extra cheese',
        'Mushroom',
        'Onion',
        'Pepperoni',
        'Sausage',
        'Tomato',
      ],
    });
  }

  formEmitter(formControl: FormControl): void {
    const filter: CoxFilter[] = [
      {
        field: 'customers',
        formControl: formControl,
      },
    ];
    this.filtersEmitter.emit(filter);
  }
  // customers = new FormControl('');
  // customerList: string[] = [
  //   'Extra cheese',
  //   'Mushroom',
  //   'Onion',
  //   'Pepperoni',
  //   'Sausage',
  //   'Tomato',
  // ];
  // projects = new FormControl('');
  // projectList: string[] = [
  //   'Extra cheese',
  //   'Mushroom',
  //   'Onion',
  //   'Pepperoni',
  //   'Sausage',
  //   'Tomato',
  // ];
  // releases = new FormControl('');
  // releaseList: string[] = [
  //   'Extra cheese',
  //   'Mushroom',
  //   'Onion',
  //   'Pepperoni',
  //   'Sausage',
  //   'Tomato',
  // ];
  // members = new FormControl('');
  // memberList: string[] = [
  //   'Extra cheese',
  //   'Mushroom',
  //   'Onion',
  //   'Pepperoni',
  //   'Sausage',
  //   'Tomato',
  // ];
  // areFiltersActive(): boolean {
  //   return (
  //     this.customers.value != null && this.customers.value.length > 0
  //      || (this.projects.value != null && this.projects.value.length > 0)
  //      || (this.releases.value != null && this.releases.value.length > 0)
  //      || (this.members.value != null && this.members.value.length > 0)
  //   );
  // }
  // remove(fruit: string): void {
  //   const index = this.customerList.indexOf(fruit);
  //   if (index >= 0) {
  //     this.customerList.splice(index, 1);
  //   }
  // }
}
