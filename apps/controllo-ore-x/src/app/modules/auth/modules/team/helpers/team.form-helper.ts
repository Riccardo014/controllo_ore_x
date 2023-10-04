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
import { TeamDataService } from '@app/_core/services/team.data-service';
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
    private _teamDataService: TeamDataService,
  ) {
    super(formBuilder, _teamDataService);
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      role: [null, Validators.required],
    });
  }

  /**
   * Set the form in creation mode, adding the password field.
   */
  setCreationMode(): void {
    this.form.addControl(
      'password',
      this.formBuilder.control(null, [
        Validators.required,
        strongPasswordValidator,
      ]),
    );
  }

  patchForm(value: UserReadDto): boolean {
    this.form.patchValue(value);
    return this.form.valid;
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
