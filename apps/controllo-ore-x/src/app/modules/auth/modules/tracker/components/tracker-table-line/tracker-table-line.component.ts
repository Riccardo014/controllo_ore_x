import { Component } from '@angular/core';
import { ExampleMockData } from 'apps/controllo-ore-x/src/assets/utils/datas/mock-data';

@Component({
  selector: 'controllo-ore-x-tracker-table-line',
  templateUrl: './tracker-table-line.component.html',
  styleUrls: ['./tracker-table-line.component.scss'],
})
export class TrackerTableLineComponent {

  exampleMockData = ExampleMockData;
  project_name = this.exampleMockData.project_name;
  release_name = this.exampleMockData.release_name;
  label = this.exampleMockData.label;
  description = this.exampleMockData.description;
  working_hours = this.exampleMockData.working_hours;
  
}
