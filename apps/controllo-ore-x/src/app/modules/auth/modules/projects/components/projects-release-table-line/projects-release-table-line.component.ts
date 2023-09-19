import { Component } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-projects-release-table-line',
  templateUrl: './projects-release-table-line.component.html',
  styleUrls: ['./projects-release-table-line.component.scss'],
})
export class ProjectsReleaseTableLineComponent {

  hours_executed = "16:00";
  hours_planned = "20:00";
  hours_billable = "30:00";

  release_version = "0.0.1";
  expiration_date = "30/07/2023";
  
}
