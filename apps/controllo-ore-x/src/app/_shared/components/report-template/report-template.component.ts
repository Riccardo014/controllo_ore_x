import { Component, Input } from '@angular/core';
import { CoxFilter } from 'libs/utils';

/**
 * Template of a report page with an header and a body
 */
@Component({
  selector: 'controllo-ore-x-report-template',
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.scss'],
})
export class ReportTemplateComponent {
  @Input() data: any;
  showedData: any;

  constructor() {
    this.showedData = this.data;
  }

  updateFulltextSearch(fulltextSearch: string): void {
    this.showedData = this.data.filter((project: any) => {
      return (
        project.name.includes(fulltextSearch) ||
        project.customer.name.includes(fulltextSearch)
      );
    });
  }

  onFilterEmit(filter: CoxFilter[]): void {
    console.log(filter);
  }
}
