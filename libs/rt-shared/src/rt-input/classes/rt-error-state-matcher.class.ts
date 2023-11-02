import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class RtErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted: boolean = form ? form.submitted === true : false;

    if (control) {
      if (control.invalid) {
        if (control.dirty || control.touched || isSubmitted) {
          return true;
        }
      }
    }
    return false;
  }
}
