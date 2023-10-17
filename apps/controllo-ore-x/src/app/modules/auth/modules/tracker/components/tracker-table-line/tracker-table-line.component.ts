import { Component, Input } from '@angular/core';
import { RtDialogService } from '@controllo-ore-x/rt-shared';
import { TrackerDialog } from '../../dialogs/tracker-dialog/tracker.dialog';
@Component({
  selector: 'controllo-ore-x-tracker-table-line',
  templateUrl: './tracker-table-line.component.html',
  styleUrls: ['./tracker-table-line.component.scss'],
})
export class TrackerTableLineComponent {
  @Input() userHour!: any;

  constructor(private _rtDialogService: RtDialogService) {}

  convertNumberToHours(number: number): string {
    const hours = Math.floor(number);
    const minutes = Math.round((number - hours) * 60).toString();
    return hours.toString().padStart(2, '0') + ':' + minutes.padStart(2, '0');
  }

  openEditUserHourDialog(): void {
    this._rtDialogService
      .open(TrackerDialog, {
        width: '600px',
        maxWidth: '600px',
        data: this.userHour,
      })
      .subscribe();
  }

  duplicateFn(): void {
    this._rtDialogService
      .open(TrackerDialog, {
        width: '600px',
        maxWidth: '600px',
        data: {
          ...this.userHour,
          isDuplication: true,
        },
      })
      .subscribe();
  }

  deleteFn(): void {
    this._rtDialogService
      .open(TrackerDialog, {
        width: '600px',
        maxWidth: '600px',
        data: {
          ...this.userHour,
          isDeletion: true,
        },
      })
      .subscribe();
  }
}
