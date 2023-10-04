import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CustomerCreateDto,
  CustomerReadDto,
  CustomerUpdateDto,
} from '@api-interfaces';
import { CustomerDataService } from '@app/_core/services/customer.data-service';
import { UpsertFormHelper } from '@app/_shared/classes/upsert-form-helper.class';

@Injectable()
export class CustomerFormHelper extends UpsertFormHelper<
  CustomerReadDto,
  CustomerCreateDto,
  CustomerUpdateDto
> {
  constructor(
    formBuilder: FormBuilder,
    private _customerDataService: CustomerDataService,
  ) {
    super(formBuilder, _customerDataService);
  }

  get createDto(): CustomerCreateDto {
    const formValues: any = this.form.getRawValue();

    return formValues;
  }

  get updateDto(): CustomerUpdateDto {
    const formValues: any = this.form.getRawValue();

    return formValues;
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  patchForm(value: CustomerReadDto): boolean {
    this.form.patchValue(value);
    return true;
  }
}
