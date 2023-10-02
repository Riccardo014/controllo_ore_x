import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiPaginatedResponse,
  RoleReadDto,
  UserCreateDto,
  UserReadDto,
  UserUpdateDto,
} from '@api-interfaces';
import { RoleDataService } from '@app/_core/services/role-data.service';
import { TeamDataService } from '@app/_core/services/team-data.service';
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
  implements SubscriptionsLifecycle
{
  override title: string = 'Crea nuovo membro';

  isPasswordVisible: boolean = false;
  userId?: string | number;
  currentRole?: string;

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
    this.subscriptionsList.push(this._getUsersRoles());
    if (!this.isCreating) {
      this.userId = this.formHelper.entityId;
      this.subscriptionsList.push(this._getUser());
    }
  }

  private _getUser(): Subscription {
    if (!this.userId) {
      throw new Error("Non è stato possibile recuperare i dati dell'utente");
    }
    return this._teamDataService.getOne(this.userId).subscribe((user: any) => {
      this.formHelper.patchForm({
        ...user,
        role: user.roleId,
      });
      this.currentRole = user.role.name;
    });
  }

  /**
   * Get users' roles from database.
   */
  private _getUsersRoles(): Subscription {
    return this._roleDataService
      .getMany({})
      .subscribe((roles: ApiPaginatedResponse<RoleReadDto>) => {
        this.userRoles = roles.data;
      });
  }

  override onSubmit(): void {
    this.formHelper.form.patchValue({
      role: this.userRoles.find(
        (role: RoleReadDto) => role.name === this.formHelper.form.value.role,
      ),
    });

    super.onSubmit();
  }

  togglePassword(): boolean | null {
    return !this.isLoading.value
      ? (this.isPasswordVisible = !this.isPasswordVisible)
      : null;
  }
}
