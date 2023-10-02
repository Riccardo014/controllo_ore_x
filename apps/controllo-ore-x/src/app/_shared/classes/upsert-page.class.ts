import { Directive, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpsertFormHelper } from '@shared/classes/upsert-form-helper.class';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RT_DIALOG_CLOSE_RESULT } from 'libs/rt-shared/src/rt-dialog/enums/rt-dialog-close-result.enum';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { BehaviorSubject } from 'rxjs';

export interface TabLabel {
  label: string;
  tabForm?: FormGroup | FormArray;
  hideOnCreation?: boolean;
}

@Directive()
export abstract class UpsertPage<T extends { _id: string }, CreateT, UpdateT>
  implements OnInit
{
  title: string = 'Page Title';
  statusChip: string = 'Status Chip';
  breadcrumbPrefix: string = 'Page Path Prefix';
  breadcrumbSuffix: string = 'Page Path Suffix';

  isCreating: boolean = true;
  isEditing: boolean = false;

  isEditEnabled: boolean = true;
  isDeleteEnabled: boolean = true;

  isFirstLoadDone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  tabs: TabLabel[] = [];
  tab: number = 0;

  protected constructor(
    public formHelper: UpsertFormHelper<T, CreateT, UpdateT>,
    private _upsertAlertSvc: AlertService,
    private _upsertDialogSvc: RtDialogService,
    private _upsertRouter: Router,
    private _upsertActivatedRoute: ActivatedRoute,
    private _routerPropertyId: string = 'id',
  ) {}

  ngOnInit(): void {
    if (this.getResourceId()) {
      this.isCreating = false;
      this.formHelper.disable();
    }
    this.init();
  }

  async init(): Promise<void> {
    this.isLoading.next(true);
    try {
      await this.formHelper.init(this.getResourceId());
    } catch (e) {
      this._upsertAlertSvc.openError(
        'Errore!',
        'Impossibile recuperare le informazioni',
        e,
      );
    }
    this.isLoading.next(false);
  }

  /**
   * Change the current tab if the page has tabs
   * @param tab
   */
  changeTab(tab: number): void {
    this.tab = tab;
  }

  /**
   * Returns the actual resource id
   */
  getResourceId(): string {
    return this._upsertActivatedRoute.snapshot.params[this._routerPropertyId];
  }

  /**
   * It handles the create function onSubmit
   * @protected
   */
  protected async onCreate(): Promise<void> {
    if (this.formHelper.invalid) {
      return;
    }

    this.isLoading.next(true);
    this.formHelper.disable();

    try {
      const entityCreated: T = await this.formHelper.create();
      this.isLoading.next(false);
      this._upsertAlertSvc.openSuccess();
      await this._upsertRouter.navigate([`../${entityCreated._id}`], {
        relativeTo: this._upsertActivatedRoute,
      });
    } catch (error) {
      this.formHelper.enable();
      this._upsertAlertSvc.openError(
        'Errore',
        "Impossibile creare l'entità",
        error,
      );
      this.isLoading.next(false);
    }
  }

  /**
   * It handles the update function onSubmit
   * @protected
   */
  protected async onUpdate(): Promise<void> {
    if (this.formHelper.invalid) {
      return;
    }

    this.isLoading.next(true);
    this.formHelper.disable();

    try {
      await this.formHelper.update();
      await this.formHelper.loadData();
      this.isLoading.next(false);
      this.formHelper.disable();

      this._upsertAlertSvc.openSuccess();
      this.isEditing = false;
    } catch (e) {
      this.isLoading.next(false);
      this.formHelper.enable();
      this._upsertAlertSvc.openError(
        'Errore',
        "Impossibile aggiornare l'entità",
        e,
      );
    }
  }

  /**
   * Method to attach on "Save" button
   */
  onSubmit(): void {
    this.isCreating ? this.onCreate() : this.onUpdate();
  }

  /**
   * Delete method that shows a prompt dialog to confirm the delete
   */
  async onDelete(): Promise<void> {
    this._upsertDialogSvc
      .openConfirmation(
        "Procedere con l'eliminazione?",
        "L'operazione non è reversibile",
      )
      .subscribe(async (r) => {
        if (r?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
          this.isLoading.next(true);
          this.formHelper.disable();
          try {
            await this.formHelper.delete();
            this._upsertAlertSvc.openSuccess();
            this.navigateBack();
          } catch (e) {
            this.isLoading.next(false);
            this.formHelper.enable();

            this._upsertAlertSvc.openError(
              'Errore!',
              'Impossibile terminare la procedura',
              e,
            );
          }
        }
      });
  }

  /**
   * Navigate backwards to a previous router node
   */
  navigateBack(): void {
    this._upsertRouter.navigate(['../'], {
      relativeTo: this._upsertActivatedRoute,
    });
  }

  /**
   * Toggle the edit mode of the page and reloads the form data.
   */
  toggleEditing(): void {
    if (this.isEditing) {
      this._upsertDialogSvc
        .openConfirmation('Annullare le modifiche correnti?')
        .subscribe(async (r) => {
          if (r?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            await this.formHelper.loadData();
            this.formHelper.disable();
            this.isEditing = false;
          }
        });
    } else {
      this.isEditing = true;
      this.formHelper.enable();
    }
  }
}
