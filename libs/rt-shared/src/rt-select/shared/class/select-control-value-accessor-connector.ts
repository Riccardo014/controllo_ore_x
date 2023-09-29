import { ControlContainer, FormControl, FormControlDirective, SelectControlValueAccessor } from '@angular/forms';
import { Directive, ElementRef, Injector, Input, Renderer2, ViewChild } from '@angular/core';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[selectcontrolvalueaccessor]' })
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class SelectControlValueAccessorConnector extends SelectControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;

  @Input()
  formControl!: FormControl;

  @Input()
  formControlName!: string;

  constructor(_renderer: Renderer2, _elementRef: ElementRef, private _injector: Injector) {
    super(_renderer, _elementRef);
  }

  get control(): FormControl {
    return this.formControl || (this.controlContainer.control?.get(this.formControlName) as FormControl);
  }

  get controlContainer(): ControlContainer {
    return this._injector.get(ControlContainer);
  }

  @Input()
  // tslint:disable-next-line: typedef
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  override get compareWith() {
    return this._compareFn;
  }

  override set compareWith(fn: (o1: any, o2: any) => boolean) {
    this._compareFn = fn;
  }

  override registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  override registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  override writeValue(obj: any): void {
    this.formControlDirective.valueAccessor?.writeValue(obj);
  }

  override setDisabledState(isDisabled: boolean): void {
    if (this.formControlDirective.valueAccessor?.setDisabledState) {
      this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
    }
  }

  // WARNING: if the function doesnt match, the first option will be selected
  private _compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
