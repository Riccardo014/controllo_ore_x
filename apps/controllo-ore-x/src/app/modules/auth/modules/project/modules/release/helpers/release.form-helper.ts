import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ReleaseCreateDto,
  ReleaseReadDto,
  ReleaseUpdateDto,
} from '@api-interfaces';
import { ReleaseDataService } from '@app/_core/services/release.data-service';
import { UpsertFormHelper } from '@app/_shared/classes/upsert-form-helper.class';

@Injectable()
export class ReleaseFormHelper extends UpsertFormHelper<
  ReleaseReadDto,
  ReleaseCreateDto,
  ReleaseUpdateDto
> {
  constructor(
    formBuilder: FormBuilder,
    private _releaseDataService: ReleaseDataService,
  ) {
    super(formBuilder, _releaseDataService);
  }

  get createDto(): ReleaseCreateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      projectId: formValues.projectId,
    };
  }

  get updateDto(): ReleaseUpdateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      projectId: formValues.projectId,
    };
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      projectId: [null],
      version: [null, Validators.required],
      hoursBudget: [null, Validators.required],
      billableHoursBudget: [null, Validators.required],
      deadline: [null, Validators.required],
    });
  }

  patchForm(value: ReleaseReadDto): boolean {
    this.form.patchValue(value);
    return true;
  }
}
