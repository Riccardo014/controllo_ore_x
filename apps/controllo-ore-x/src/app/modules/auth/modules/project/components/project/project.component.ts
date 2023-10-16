import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'controllo-ore-x-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  @Input() projectWithCustomer!: any;

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

  @Output() duplicate: EventEmitter<any> = new EventEmitter<any>();

  isPanelOpen: boolean = false;
  customExpandedHeight: string = '90px';

  constructor(private _router: Router) {}

  edit(): void {
    this.openDialog.emit(this.projectWithCustomer);
  }

  openCreateReleaseDialog(): void {
    this._router.navigate([
      this._router.url +
        '/' +
        this.projectWithCustomer._id +
        '/release/' +
        '/create',
    ]);
  }

  openReleaseIndexPage(): void {
    this._router.navigate([
      this._router.url + '/' + this.projectWithCustomer._id + '/release',
    ]);
  }

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }

  duplicateFn(): void {
    this.duplicate.emit(this.projectWithCustomer);
  }
}
