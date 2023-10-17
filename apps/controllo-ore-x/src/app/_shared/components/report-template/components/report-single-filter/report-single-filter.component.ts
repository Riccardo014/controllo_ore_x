import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'controllo-ore-x-report-single-filter',
  templateUrl: './report-single-filter.component.html',
  styleUrls: ['./report-single-filter.component.scss'],
})
export class ReportSingleFilterComponent {
  @Input() singleLabel: string = '';
  @Input() multiLabel: string = '';

  @Input() list: any[] = [];

  formControl = new FormControl('');

  @Output() formControlEmitter: EventEmitter<FormControl> =
    new EventEmitter<FormControl>();

  onSelected(): void {
    this.formControlEmitter.emit(this.formControl);
  }

  getLabel(length: number | undefined): string {
    if (!length) {
      return '';
    }
    if (length === 1) {
      return '1 ' + this.singleLabel;
    } else {
      return (length || 0) + ' ' + this.multiLabel;
    }
  }
}
