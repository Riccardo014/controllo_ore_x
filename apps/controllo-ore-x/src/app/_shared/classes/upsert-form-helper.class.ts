import { FormBuilder } from '@angular/forms';
import { DataService } from '@controllo-ore-x/rt-shared';
import { FormHelper } from '@shared/classes/form-helper.class';

/**
 * Class that handles a form and implements create, update, delete and basic get functions
 */
export abstract class UpsertFormHelper<
  T,
  CreateT,
  UpdateT,
> extends FormHelper<T> {
  /**
   * ID of the current entity in case of update.
   */
  entityId?: string;

  /**
   * Value that stores the current entity in case of update. It is used to patch the form initially.
   */
  currentEntity?: T;

  protected constructor(
    protected override formBuilder: FormBuilder,
    private _dataService: DataService<T, CreateT, UpdateT>,
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
  async create(): Promise<T> {
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
  update(): Promise<T> {
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
        next: (res) => {
          this.patchForm(res?.data);
          this.currentEntity = res?.data;
          return resolve();
        },
        error: (err) => {
          return reject(err);
        },
      });
    });
  }
}
