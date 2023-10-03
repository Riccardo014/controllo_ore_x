import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * It's a helper class to manage the form in the upsert pages
 */
export abstract class FormHelper<T> {
  form!: FormGroup;

  protected constructor(protected formBuilder: FormBuilder) {
    this.form = this.initForm();
  }

  /**
   * Return the form to be used in _form and initialize the FormGroup
   */
  abstract initForm(): FormGroup;

  /**
   * Returns boolean value if patch is done successfully
   */
  abstract patchForm(value: T): boolean;

  /**
   * Return whether or not the form is not valid
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
