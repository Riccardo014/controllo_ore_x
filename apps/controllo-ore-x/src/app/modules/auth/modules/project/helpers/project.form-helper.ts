import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
} from '@api-interfaces';
import { ProjectDataService } from '@app/_core/services/project.data-service';
import { UpsertFormHelper } from '@app/_shared/classes/upsert-form-helper.class';

@Injectable()
export class ProjectFormHelper extends UpsertFormHelper<
  ProjectReadDto,
  ProjectCreateDto,
  ProjectUpdateDto
> {
  constructor(
    formBuilder: FormBuilder,
    private _projectDataService: ProjectDataService,
  ) {
    super(formBuilder, _projectDataService);
  }

  get createDto(): ProjectCreateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      customerId: formValues.customer._id,
    };
  }

  get updateDto(): ProjectUpdateDto {
    const formValues: any = this.form.getRawValue();

    return {
      ...formValues,
      customerId: formValues.customer._id,
    };
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      customer: [null, Validators.required],
      color: [null, Validators.required],
      hoursBudget: [null, [Validators.required]],
      deadline: [null, Validators.required],
    });
  }

  patchForm(value: ProjectReadDto): boolean {
    if(value){
      this.form.patchValue(value);
      this.form.patchValue({
        color: this.rgbaToHex(this.form.value.color),
      });
      return true;
    }
    throw new Error('Value is undefined');
  }

  rgbaToHex(rgbaColor: string): string {
    const rgb: any = rgbaColor.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    const hex = (rgb && rgb.length === 4) ? ('#' +
    ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[3],10).toString(16)).slice(-2)) : '';
    return hex;
  }
}
