import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'controllo-ore-x-tracker-table-line',
  templateUrl: './tracker-table-line.component.html',
  styleUrls: ['./tracker-table-line.component.scss'],
})
export class TrackerTableLineComponent {

  @Input() userHour!: any;

  constructor(private _router: Router) { }
  
  convertNumberToHours(number: number): string {
    const hours = Math.floor(number);
    const minutes = Math.round((number - hours) * 60).toString();
    return hours.toString().padStart(2, '0') + ':' + minutes.padStart(2, '0');
  }

  openEditUserHourDialog(): void {
    this._router.navigate([this._router.url + '/' + this.userHour._id]);
  }

}
