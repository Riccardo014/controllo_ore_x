import { Component } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-tracker-table-line',
  templateUrl: './tracker-table-line.component.html',
  styleUrls: ['./tracker-table-line.component.scss'],
})
export class TrackerTableLineComponent {

  project_name = 'Calzedonia Real Estate';
  release_name = 'Release 0.0.1';
  label = 'Design';
  description = 'Refactor grafica tracker';
  working_hours = '05:30';

}
