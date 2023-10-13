import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  RoleReadDto,
  UserCreateDto,
  UserReadDto,
  UserUpdateDto,
} from '@api-interfaces';
import { RoleDataService } from '@app/_core/services/role.data-service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { Subscription } from 'rxjs';
import { TeamFormHelper } from '../../helpers/team.form-helper';

@Component({
  selector: 'controllo-ore-x-team-upsert',
  templateUrl: './team-upsert.page.html',
  styleUrls: ['./team-upsert.page.scss'],
  providers: [TeamFormHelper],
})
export class TeamUpsertPage
  extends UpsertPage<UserReadDto, UserCreateDto, UserUpdateDto>
  implements SubscriptionsLifecycle, OnDestroy, OnInit
{
  override title: string = 'Crea nuovo membro';

  isPasswordVisible: boolean = false;
  userId?: string | number;
  currentRole?: RoleReadDto;

  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  userRoles: RoleReadDto[] = [];
  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: TeamFormHelper,
    private _teamDataService: TeamDataService,
    private _alertService: AlertService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _roleDataService: RoleDataService,
  ) {
    super(
      formHelper,
      _alertService,
      _rtDialogService,
      _router,
      _activatedRoute,
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._setSubscriptions();

    if (this.isCreating) {
      this.formHelper.setCreationMode();
      return;
    }
    this.title = 'Modifica membro';
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    // If the user is editing an existing user, get the user's data, otherwhise the entityId field will be empty.
    if (!this.isCreating) {
      this.userId = this.formHelper.entityId;
      this.subscriptionsList.push(this._getUser());
    }
    else{
      this.subscriptionsList.push(this._getUsersRoles());
    }
  }

  override handleUserSubmission(): void {
    this.formHelper.form.patchValue({
      role: this.userRoles.find(
        (role: RoleReadDto) => role.name === this.formHelper.form.value.role,
      ),
    });

    super.handleUserSubmission();
  }

  togglePasswordVisibility(): void {
    if (!this.isLoading.value) {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
  }

  /**
   * Get the user's data from the database.
   */
  private _getUser(): Subscription {
    if (!this.userId) {
      throw new Error("Non è stato possibile recuperare i dati dell'utente");
    }
    return this._teamDataService.getOne(this.userId).subscribe((user: any) => {
      this.formHelper.patchForm(user);
      this._getUsersRoles();
    });
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
            (role: RoleReadDto) => role._id === this.formHelper.form.value.role._id);
        }
      });
  }
}
