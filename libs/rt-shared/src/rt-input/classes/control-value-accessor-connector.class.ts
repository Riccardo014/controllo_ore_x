import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective } from '@angular/forms';
import { Directive, Injector, Input, ViewChild } from '@angular/core';

@Directive()
export class ControlValueAccessorConnector implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;

  @Input()
  formControl?: FormControl;

  @Input()
  formControlName?: string;

  @Input()
  value?: any;

  constructor(private _injector: Injector) {}

  get control(): FormControl | null {
    if (!this.formControl && !this.formControlName) {
      return null;
    }
    return this.formControl || (this.controlContainer.control?.get(this.formControlName!) as FormControl);
  }

  get controlContainer(): ControlContainer {
    return this._injector.get(ControlContainer);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnChange(fn);
  }

  writeValue(obj: any): void {
    this.formControlDirective?.valueAccessor?.writeValue(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.formControlDirective?.valueAccessor?.setDisabledState) {
      this.formControlDirective?.valueAccessor?.setDisabledState(isDisabled);
    }
  }
}
