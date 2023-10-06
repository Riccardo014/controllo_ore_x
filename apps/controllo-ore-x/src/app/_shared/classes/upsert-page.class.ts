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

/**
 * It's a helper class to manage the upsert pages.
 */
@Directive()
export abstract class UpsertPage<
  ReadT extends { _id: string },
  CreateT,
  UpdateT,
> implements OnInit
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
    public formHelper: UpsertFormHelper<ReadT, CreateT, UpdateT>,
    private _upsertAlertSvc: AlertService,
    private _upsertDialogSvc: RtDialogService,
    private _upsertRouter: Router,
    private _upsertActivatedRoute: ActivatedRoute,
    private _routerPropertyId: string = 'id',
  ) {}

  /**
   * Prompt the user for confirmation on the deletion operation by opening a dialog. Delete entry if the user confirms the operation.
   */
  async deleteEntry(): Promise<void> {
    this._upsertDialogSvc
      .openConfirmation(
        "Procedere con l'eliminazione?",
        "L'operazione non è reversibile",
      )
      .subscribe({
        next: async (r) => {
          if (r?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.isLoading.next(true);
            this.formHelper.disable();
            try {
              await this.formHelper.delete();
              this._upsertAlertSvc.openSuccess();
              this.navigateBack();
            } catch (err) {
              this.isLoading.next(false);
              this.formHelper.enable();

              this._upsertAlertSvc.openError(
                'Errore!',
                'Impossibile terminare la procedura',
                err,
              );
            }
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnInit(): void {
    if (this.getEntityId()) {
      this.isCreating = false;
      this.formHelper.disable();
    }
    this.pageInitialization();
  }

  async pageInitialization(): Promise<void> {
    this.isLoading.next(true);
    try {
      await this.formHelper.init(this.getEntityId());
    } catch (err) {
      this._upsertAlertSvc.openError(
        'Errore!',
        'Impossibile recuperare le informazioni',
        err,
      );
    }
    this.isLoading.next(false);
  }

  /**
   * Update the component's tab to the passed tab number.
   */
  setTab(tab: number): void {
    this.tab = tab;
  }

  /**
   * Return the entity's id.
   */
  getEntityId(): string {
    return this._upsertActivatedRoute.snapshot.params[this._routerPropertyId];
  }

  /**
   * Perform a create or update operation depending on the `isCreating` flag.
   */
  handleUserSubmission(): void {
    this.isCreating ? this._createEntry() : this._updateEntry();
  }

  /**
   * Create an entity if the form is valid. Set loading to true and disable form while waiting for the operation to complete.
   */
  private async _createEntry(): Promise<void> {
    if (this.formHelper.invalid) {
      throw new Error('The form is not valid');
    }

    this.isLoading.next(true);
    this.formHelper.disable();

    try {
      const entityCreated: ReadT = await this.formHelper.create();
      this.isLoading.next(false);
      this._upsertAlertSvc.openSuccess();
      await this._upsertRouter.navigate([`../${entityCreated._id}`], {
        relativeTo: this._upsertActivatedRoute,
      });
    } catch (err) {
      this.formHelper.enable();
      this._upsertAlertSvc.openError(
        'Errore',
        "Impossibile creare l'entità",
        err,
      );
      this.isLoading.next(false);
    }
  }

  /**
   * Update the entity if the form is valid. Set loading to true and disable form while waiting for the operation to complete.
   */
  private async _updateEntry(): Promise<void> {
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
    } catch (err) {
      this.isLoading.next(false);
      this.formHelper.enable();
      this._upsertAlertSvc.openError(
        'Errore',
        "Impossibile aggiornare l'entità",
        err,
      );
    }
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
   * Toggle the `isEditing` flag of the page. If stopping to edit; show a dialog asking for confirmation and reload the form data on confirm.
   */
  toggleEditing(): void {
    if (this.isEditing) {
      this._upsertDialogSvc
        .openConfirmation('Annullare le modifiche correnti?')
        .subscribe(async (res) => {
          if (res?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
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
