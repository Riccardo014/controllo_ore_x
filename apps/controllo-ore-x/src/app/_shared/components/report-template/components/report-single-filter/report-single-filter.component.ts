import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COX_FILTER } from '@api-interfaces';

@Component({
  selector: 'controllo-ore-x-report-single-filter',
  templateUrl: './report-single-filter.component.html',
  styleUrls: ['./report-single-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReportSingleFilterComponent),
      multi: true,
    },
  ],
})
export class ReportSingleFilterComponent implements OnInit {
  @Output() change: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() singleLabel: string = '';
  @Input() multiLabel: string = '';
  @Input() fieldName!: COX_FILTER;
  @Input() list: any[] = [];
  @Input() formControl = new FormControl();

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe((value) => {
      this.change.emit(value);
    });
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

  value: string = '';
  writeValue(value: string): void {
    this.value = value ? value : '';
  }
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
