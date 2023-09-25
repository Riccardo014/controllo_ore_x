import { Component } from '@angular/core';
import { ExampleMockData } from 'apps/controllo-ore-x/src/assets/utils/datas/mock-data';

@Component({
  selector: 'controllo-ore-x-customer-table-line',
  templateUrl: './customer-table-line.component.html',
  styleUrls: ['./customer-table-line.component.scss'],
})
export class CustomerTableLineComponent {
  
  exampleMockData = ExampleMockData;
  name = this.exampleMockData.name;
  email = this.exampleMockData.email;
  creation_date = this.exampleMockData.creation_date;
  
}
