import { FormBuilder, FormGroup } from '@angular/forms';

export abstract class FormHelper<T> {
  form!: FormGroup;

  protected constructor(protected formBuilder: FormBuilder) {
    this.form = this.initForm();
  }

  /**
   * Returns the form to be used in _form
   */
  abstract initForm(): FormGroup;

  /**
   * Returns boolean value if patch is done successfully
   * @param value
   */
  abstract patchForm(value: T): boolean;

  /**
   * It gets form valid value
   */
  get valid(): boolean {
    return this.form.valid;
  }

  /**
   * It gets form invalid value
   */
  get invalid(): boolean {
    return this.form.invalid;
  }

  disable(): void {
    this.form.disable();
  }

  enable(): void {
    this.form.enable();
  }
}
