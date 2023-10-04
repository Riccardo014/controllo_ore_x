import {
  Directive,
  ElementRef,
  Injector,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormControlDirective,
  SelectControlValueAccessor,
} from '@angular/forms';

@Directive({ selector: '[selectcontrolvalueaccessor]' })
export class SelectControlValueAccessorConnector extends SelectControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;

  @Input()
  formControl!: FormControl;

  @Input()
  formControlName!: string;

  constructor(
    _renderer: Renderer2,
    _elementRef: ElementRef,
    private _injector: Injector,
  ) {
    super(_renderer, _elementRef);
  }

  get control(): FormControl {
    const control =
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName) as FormControl);

    if (!control) {
      throw new Error(`FormControl "${this.formControlName}" is undefined.`);
    }

    return control;
  }

  get controlContainer(): ControlContainer {
    return this._injector.get(ControlContainer);
  }

  /**
   * Compare two elements and return whether or not they are equal.
   */
  @Input()
  override get compare(): any {
    return this._compareFn;
  }

  /**
   * Set a compare function that takes two parameters and returns a boolean.
   */
  override set compare(fn: (item1: any, item2: any) => boolean) {
    if (fn.length !== 2) {
      throw new Error('Compare function must take exactly two parameters.');
    }
    this._compareFn = fn;
  }

  override registerOnTouched(fn: Function): void {
    this.formControlDirective.valueAccessor?.bindFunctionToTouchEvent(fn);
  }

  // WARNING: if the function doesnt match, the first option will be selected
  private _compareFn(c1: any, c2: any): boolean {
    if (c1 && c2) {
      return c1.id === c2.id;
    }
    return c1 === c2;
  }
}
