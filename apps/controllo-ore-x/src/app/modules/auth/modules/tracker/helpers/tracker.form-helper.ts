import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  UserHoursCreateDto,
  UserHoursReadDto,
  UserHoursUpdateDto,
} from '@api-interfaces';
import { TrackerDataService } from '@app/_core/services/tracker.data-service';
import { UpsertFormHelper } from '@app/_shared/classes/upsert-form-helper.class';

@Injectable()
export class TrackerFormHelper extends UpsertFormHelper<
  UserHoursReadDto,
  UserHoursCreateDto,
  UserHoursUpdateDto
> {
  constructor(
    formBuilder: FormBuilder,
    private _trackerDataService: TrackerDataService,
  ) {
    super(formBuilder, _trackerDataService);
  }

  //TODO
  get createDto(): UserHoursCreateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      userId: formValues.user,
      customerId: formValues.customer._id,
      projectId: formValues.project._id,
      releaseId: formValues.release._id,
      hoursTagId: formValues.hoursTag._id,
    };
  }

  //TODO
  get updateDto(): UserHoursUpdateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      customerId: formValues.customer._id,
    };
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      user: [null, Validators.required],
      customer: [null, Validators.required],
      project: [null, Validators.required],
      release: [null, Validators.required],
      hoursTag: [null, Validators.required],
      date: [null, Validators.required],
      notes: [null, Validators.required],
      hours: [null, Validators.required],
    });
  }

  //TODO
  patchForm(value: UserHoursReadDto): boolean {
    this.form.patchValue(value);
    return true;
  }

}
