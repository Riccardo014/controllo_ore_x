import { Component } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-projects-table-header',
  templateUrl: './projects-table-header.component.html',
  styleUrls: ['./projects-table-header.component.scss'],
})
export class ProjectsTableHeaderComponent {

  project_name = ['Calzedonia Real Estate', 'Social Kizy'];
  customer_name = ['Addvalue', 'IESS'];
}
