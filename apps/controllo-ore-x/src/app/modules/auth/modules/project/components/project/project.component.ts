import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RtDialogService } from '@controllo-ore-x/rt-shared';
import { ReleaseDialog } from '../../modules/release/dialogs/release-dialog/release.dialog';

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

  constructor(
    private _router: Router,
    private _rtDialogService: RtDialogService,
  ) {}

  edit(): void {
    this.openDialog.emit(this.projectWithCustomer);
  }

  openCreateReleaseDialog(): void {
    this._rtDialogService
      .open(ReleaseDialog, {
        width: '600px',
        maxWidth: '600px',
        data: {
          ...this.projectWithCustomer,
          isCreating: true,
        },
      })
      .subscribe();
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
