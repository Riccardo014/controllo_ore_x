import { Directive, Injector, Input, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
} from '@angular/forms';

@Directive()
export class ControlValueAccessorConnector implements ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective?: FormControlDirective;

  @Input()
  formControl?: FormControl;

  @Input()
  formControlName?: string;

  @Input()
  value?: any;

  constructor(private _injector: Injector) {
    if (!this.formControlDirective) {
      throw new Error('FormControlDirective is undefined');
    }
  }

  get control(): FormControl | null {
    if (!this.formControl && !this.formControlName) {
      return null;
    }
    return (
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName!) as FormControl)
    );
  }

  get controlContainer(): ControlContainer {
    return this._injector.get(ControlContainer);
  }

  bindFunctionToTouchEvent(fn: Function): void {
    this.checkFormControlDirective();
    this.formControlDirective!.valueAccessor!.bindFunctionToTouchEvent(fn);
  }

  registerOnChange(fn: Function): void {
    this.checkFormControlDirective();

    this.formControlDirective!.valueAccessor!.registerOnChange(fn);
  }

  /**
   * Write a value to the element
   */
  writeValue(obj: any): void {
    this.checkFormControlDirective();
    this.formControlDirective!.valueAccessor!.writeValue(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.checkFormControlDirective();
    if (
      typeof this.formControlDirective!.valueAccessor!.setDisabledState !==
      'function'
    ) {
      throw new Error('setDisabledState method is undefined');
    }
    this.formControlDirective!.valueAccessor!.setDisabledState(isDisabled);
  }

  checkFormControlDirective(): void {
    if (!this.formControlDirective) {
      throw new Error('FormControlDirective is undefined');
    }

    if (!this.formControlDirective.valueAccessor) {
      throw new Error('ValueAccessor is undefined');
    }
  }
}
