import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FindBoostedOrder, TableConfigurationColumn } from '@api-interfaces';

@Component({
  selector: 'lib-rt-table-th',
  templateUrl: './rt-table-th.component.html',
  styleUrls: ['./rt-table-th.component.scss'],
})
export class RtTableThComponent {
  @Output() orderChangedEvent: EventEmitter<FindBoostedOrder> =
    new EventEmitter<FindBoostedOrder>();

  @Input() column!: TableConfigurationColumn;

  orderIndex: number = 0;
  ORDER_BY_TYPE: { ASC: string; DESC: string } = {
    ASC: 'ASC',
    DESC: 'DESC',
  };
  currentOrder?: 'ASC' | 'DESC';
  _orderBy?: FindBoostedOrder;

  @Input() set orderBy(value: FindBoostedOrder | undefined) {
    this._orderBy = value;

    this.orderIndex = this._getOrderIndex();
    // set initial order for column
    this.currentOrder = this._orderBy
      ? this._orderBy[this.column.field]
      : undefined;
  }

  toggleOrderBy(): void {
    if (!this.column.sortable) {
      return;
    }
    const newOrderBy: FindBoostedOrder = { ...this._orderBy };

    switch (this.currentOrder) {
      case 'ASC':
        newOrderBy[this.column.field] = 'DESC';
        break;
      case 'DESC':
        delete newOrderBy[this.column.field];
        break;
      case undefined:
        newOrderBy[this.column.field] = 'ASC';
        break;
    }
    this.orderChangedEvent.emit(newOrderBy);
  }

  private _getOrderIndex(): number {
    let index: number = 0;
    if (!this._orderBy) {
      return index;
    }
    const keys: string[] = Object.keys(this._orderBy);
    for (const [indicator, key] of Object.entries(keys)) {
      if (this.column.field === key) {
        index = Number(indicator) + 1;
      }
    }

    return index;
  }
}
