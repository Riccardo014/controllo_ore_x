import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiPaginatedResponse, RoleReadDto } from '@api-interfaces';
import { RoleDataService } from '@app/_core/services/role.data-service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  IRtDialogInput,
  RT_DIALOG_CLOSE_RESULT,
  RtDialogForm,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { Subscription, finalize } from 'rxjs';
import { TeamFormHelper } from '../../helpers/team.form-helper';

@Component({
  selector: 'controllo-ore-x-team-dialog',
  templateUrl: './team.dialog.html',
  styleUrls: ['./team.dialog.scss'],
  providers: [TeamFormHelper],
})
export class TeamDialog
  extends RtDialogForm
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  title: string = 'Crea nuovo membro';
  isPasswordVisible: boolean = false;

  isCreating: boolean = true;

  currentRole?: RoleReadDto;
  userRoles: RoleReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    protected _fb: FormBuilder,
    protected _matDialogRef: MatDialogRef<TeamDialog>,
    private _teamDataService: TeamDataService,
    private _upsertDialogSvc: RtDialogService,
    private _upsertAlertSvc: AlertService,
    public formHelper: TeamFormHelper,
    private _roleDataService: RoleDataService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
  ) {
    super();
  }

  ngOnInit(): void {
    this._setSubscriptions();

    if (!this.data.input) {
      this.formHelper.setCreationMode();
      return;
    }
    this.isCreating = false;
    this.formHelper.patchForm(this.data.input);
    this.formHelper.entityId = this.data.input._id;
    this.title = 'Modifica membro';
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  override onSubmit(): void {
    if (this.formHelper.invalid) {
      return;
    }

    this.isLoading = true;

    this.formHelper.disable();

    this.isCreating ? this._createUser() : this._updateUser();
  }

  delete(): void {
    this._upsertDialogSvc
      .openConfirmation(
        "Procedere con l'eliminazione?",
        "L'operazione non è reversibile",
      )
      .subscribe({
        next: async (r) => {
          if (r?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this.isLoading = true;
            this.formHelper.disable();
            try {
              await this.formHelper.delete();
              this._upsertAlertSvc.openSuccess();
              this.cancel();
              const currentUrl = this._router.url;
              this._router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this._router.navigate([`/${currentUrl}`]);
                });
            } catch (err) {
              this.isLoading = false;
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

  _setSubscriptions(): void {
    this.subscriptionsList.push(this._getUsersRoles());
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Fetch and set the users' roles from the database.
   */
  private _getUsersRoles(): Subscription {
    return this._roleDataService
      .getMany({})
      .subscribe((roles: ApiPaginatedResponse<RoleReadDto>) => {
        this.userRoles = roles.data;
        if (this.formHelper.form.value.role) {
          this.currentRole = this.userRoles.find(
            (role: RoleReadDto) =>
              role._id === this.formHelper.form.value.role._id,
          );
        }
      });
  }

  private _createUser(): void {
    this._teamDataService
      .create(this.formHelper.createDto)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this._matDialogRef.close({
            result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
          });
          const currentUrl = this._router.url;
          this._router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this._router.navigate([`/${currentUrl}`]);
            });
        },
        error: () => {
          this.hasErrors = true;
        },
      });
  }

  private _updateUser(): void {
    this._teamDataService
      .update(this.data.input._id, this.formHelper.updateDto)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this._matDialogRef.close({
            result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
          });
          const currentUrl = this._router.url;
          this._router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this._router.navigate([`/${currentUrl}`]);
            });
        },
        error: () => {
          this.hasErrors = true;
        },
      });
  }
}
