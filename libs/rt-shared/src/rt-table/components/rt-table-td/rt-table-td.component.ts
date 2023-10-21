import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROLE, TableConfigurationColumn } from '@api-interfaces';
import { rtTableColumnValue } from '../../lib/rt-table-column-value';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'lib-rt-table-td',
  templateUrl: './rt-table-td.component.html',
  styleUrls: ['./rt-table-td.component.scss'],
})
export class RtTableTdComponent implements OnInit {
  @Input() column!: TableConfigurationColumn;
  @Input() entity: any;

  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();

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
    this.openDialog.emit(entity);
  }
}
