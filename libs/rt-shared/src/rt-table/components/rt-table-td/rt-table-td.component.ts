import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROLE, TableConfigurationColumn } from '@api-interfaces';
import { rtTableColumnValue } from '../../lib/rt-table-column-value';

@Component({
  selector: 'lib-rt-table-td',
  templateUrl: './rt-table-td.component.html',
  styleUrls: ['./rt-table-td.component.scss'],
})
export class RtTableTdComponent implements OnInit {
  @Input() column!: TableConfigurationColumn;
  @Input() entity: any;

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  valueToPrint: any;

  roles: ROLE[] = [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.COLLABORATOR];

  constructor() {
    registerLocaleData(localeIt);
  }

  ngOnInit(): void {
    this.valueToPrint = this.getColumnData();
  }

  getColumnData(): any {
    return rtTableColumnValue(this.column, this.entity);
  }

  openDialogFn(entity: any): void {
    this.openDialogEvent.emit(entity);
  }

  convertNumberToHours(hoursToConvert: number): string {
    const hours = Math.floor(hoursToConvert);
    const minutes = Math.round((hoursToConvert - hours) * 60).toString();
    return hours.toString().padStart(2, '0') + ':' + minutes.padStart(2, '0');
  }
}
