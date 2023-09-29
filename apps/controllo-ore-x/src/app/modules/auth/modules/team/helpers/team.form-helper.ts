import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserCreateDto, UserReadDto, UserUpdateDto } from '@api-interfaces';
import { UserDataService } from '@app/_core/services/user-data.service';
import { UpsertFormHelper } from '@app/_shared/classes/upsert-form-helper.class';
import { strongPasswordValidator } from '@app/_shared/validators/strong-password.validator';

@Injectable()
export class TeamFormHelper extends UpsertFormHelper<
  UserReadDto,
  UserCreateDto,
  UserUpdateDto
> {
  constructor(
    formBuilder: FormBuilder,
    private _userDataService: UserDataService,
  ) {
    super(formBuilder, _userDataService);
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, strongPasswordValidator]],
      role: [null, Validators.required],
    });
  }

  setEditMode(): void {
    this.form.addControl(
      'isEnabled',
      this.formBuilder.control(null, Validators.required),
    );
  }

  patchForm(value: UserReadDto): boolean {
    this.form.patchValue(value);
    return true;
  }

  get createDto(): UserCreateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      roleId: formValues.role._id,
    };
  }

  get updateDto(): UserUpdateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      roleId: formValues.role._id,
    };
  }

  matchValidator(source: string, target: string): ValidatorFn {
    return (): ValidationErrors | null => {
      const sourceCtrl: AbstractControl<any, any> | null =
        this.form.get(source);
      const targetCtrl: AbstractControl<any, any> | null =
        this.form.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
}
