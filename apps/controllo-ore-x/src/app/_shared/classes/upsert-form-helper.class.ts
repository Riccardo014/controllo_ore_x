import { FormBuilder } from '@angular/forms';
import { BaseDataService } from '@controllo-ore-x/rt-shared';
import { FormHelper } from '@shared/classes/form-helper.class';

/**
 * The UpsertFormHelper is used for the creation, update and delete a form; it also handle basic functions.
 */
export abstract class UpsertFormHelper<
  ReadT,
  CreateT,
  UpdateT,
> extends FormHelper<ReadT> {
  /**
   * ID of the current entity.
   */
  entityId?: string;

  /**
   * Value that stores the current entity. It is used to patch the form initially.
   */
  currentEntity?: ReadT;

  protected constructor(
    protected override formBuilder: FormBuilder,
    private _dataService: BaseDataService<ReadT, CreateT, UpdateT>,
  ) {
    super(formBuilder);
    this.form = this.initForm();
  }

  async init(entityId?: string): Promise<void> {
    this.entityId = entityId;
    await this.loadData();
  }

  abstract get createDto(): CreateT;

  abstract get updateDto(): UpdateT;

  /**
   * It handles the create function using the dataService
   */
  async create(): Promise<ReadT> {
    return new Promise((resolve, reject) => {
      if (this.invalid) {
        return reject();
      }

      this._dataService.create(this.createDto).subscribe({
        next: (res: any) => {
          return resolve(res.data);
        },
        error: (err: any) => {
          return reject(err);
        },
      });
    });
  }

  /**
   * It handles the update function using the dataService
   */
  update(): Promise<ReadT> {
    return new Promise((resolve, reject) => {
      if (this.invalid || !this.entityId) {
        return reject();
      }
      this._dataService.update(this.entityId, this.updateDto).subscribe({
        next: (res: any) => {
          return resolve(res.data);
        },
        error: (err: any) => {
          return reject(err);
        },
      });
    });
  }

  /**
   * It handles the delete function using the dataService
   */
  delete(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.entityId) {
        return reject();
      }
      this._dataService.delete(this.entityId).subscribe({
        next: () => {
          this.currentEntity = undefined;
          this.entityId = undefined;
          return resolve();
        },
        error: (err) => {
          return reject(err);
        },
      });
    });
  }

  /**
   * Method to fetch the entity and patch the form.
   */
  async loadData(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.entityId) {
        return resolve();
      }

      this._dataService.getOne(this.entityId).subscribe({
        next: (res: any) => {
          this.patchForm(res);
          this.currentEntity = res;
          return resolve();
        },
        error: (err) => {
          return reject(err);
        },
      });
    });
  }
}
