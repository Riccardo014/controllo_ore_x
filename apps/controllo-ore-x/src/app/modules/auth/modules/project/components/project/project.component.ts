import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerReadDto, ProjectReadDto } from '@api-interfaces';

@Component({
  selector: 'controllo-ore-x-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  @Input() projectWithCustomer!: any;

  isPanelOpen: boolean = false;
  customExpandedHeight: string = '90px';

  constructor( private _router: Router ) {}

  openDialogFn(): void {
    this._router.navigate([this._router.url + '/' + this.projectWithCustomer._id]);
  }

  openCreateReleaseDialog(): void {
  this._router.navigate([this._router.url + '/' + this.projectWithCustomer._id + '/release/' + '/create']);
  }

  openReleaseIndexPage(): void {
    this._router.navigate([this._router.url + '/' + this.projectWithCustomer._id + '/release']);
  }

}
