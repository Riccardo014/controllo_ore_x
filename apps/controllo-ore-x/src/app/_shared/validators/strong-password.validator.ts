import { AbstractControl } from '@angular/forms';

export function strongPasswordValidator(control: AbstractControl): { strong: true } | null {
  const password: any = control.value;
  const regex: RegExp = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).{8,}$/
  );

  if (!password) {
    return null;
  }

  const isStrong: boolean = regex.test(password);

  if (!isStrong) {
    return { strong: true };
  }

  return null;
}

