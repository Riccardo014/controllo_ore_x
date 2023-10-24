import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  RoleReadDto,
  UserCreateDto,
  UserReadDto,
  UserUpdateDto,
} from '@api-interfaces';
import { RoleDataService } from '@app/_core/services/role.data-service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import { BaseDialog } from '@app/_shared/classes/base-dialog.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { IRtDialogInput, RtDialogService } from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { Subscription } from 'rxjs';
import { TeamFormHelper } from '../../helpers/team.form-helper';

@Component({
  selector: 'controllo-ore-x-team-dialog',
  templateUrl: './team.dialog.html',
  styleUrls: ['./team.dialog.scss'],
  providers: [TeamFormHelper],
})
export class TeamDialog
  extends BaseDialog<UserReadDto, UserCreateDto, UserUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  override title: string = 'Crea nuovo membro';
  isPasswordVisible: boolean = false;

  currentRole?: RoleReadDto;
  userRoles: RoleReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: TeamFormHelper,
    protected override _formBuilder: FormBuilder,
    protected _matDialogRef: MatDialogRef<TeamDialog>,
    private _teamDataService: TeamDataService,
    private _rtDialogService: RtDialogService,
    private _alertService: AlertService,
    private _router: Router,
    private _roleDataService: RoleDataService,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
  ) {
    super(formHelper, _formBuilder, _rtDialogService, _alertService, _router);
  }

  ngOnInit(): void {
    this._setSubscriptions();

    if (!this.data.input) {
      this.formHelper.setCreationMode();
      return;
    }
    this.transactionStatus = 'update';
    this.formHelper.patchForm(this.data.input);
    this.formHelper.entityId = this.data.input._id;
    this.title = 'Modifica membro';
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
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
    return this._roleDataService.getMany({}).subscribe({
      next: (roles: ApiPaginatedResponse<RoleReadDto>) => {
        this.userRoles = roles.data;
        if (this.formHelper.form.value.role) {
          this.currentRole = this.userRoles.find(
            (role: RoleReadDto) =>
              role._id === this.formHelper.form.value.role._id,
          );
        }
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }
}
