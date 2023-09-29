import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRtWrapBase, RoleReadDto, UserCreateDto, UserReadDto, UserUpdateDto } from '@api-interfaces';
import { UserDataService } from '@app/_core/services/user-data.service';
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { TeamFormHelper } from '../../helpers/team.form-helper';
import { SubscriptionsLifecycle, completeSubscriptions } from '@app/utils/subscriptions_lifecycle';
import { Subscription } from 'rxjs';
import { RoleDataService } from '@app/_core/services/role-data.service';

@Component({
  selector: 'controllo-ore-x-team-upsert',
  templateUrl: './team-upsert.page.html',
  styleUrls: ['./team-upsert.page.scss'],
  providers: [TeamFormHelper],
})
export class TeamUpsertPage extends UpsertPage<
  UserReadDto,
  UserCreateDto,
  UserUpdateDto
>  implements SubscriptionsLifecycle {
  override title: string = 'Crea nuovo membro';

  isPasswordVisible: boolean = false;


  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  userRoles: RoleReadDto[] = [];
  availableRoles: string[] = [];
  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public override formHelper: TeamFormHelper,
    private _userDataService: UserDataService,
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
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(this._getUsersRoles());
  }

  /**
   * Get users' roles from database.
   */
  private _getUsersRoles(): Subscription {
    return this._roleDataService.getMany({}).subscribe({
      next: (res: IRtWrapBase<RoleReadDto[]>) => {
        this.userRoles = res.data;
        this.availableRoles = this.userRoles.map((role: RoleReadDto) => role.name);
      },
      error: () => {
        throw new Error('Si è verificato un errore durante l\'ottenimento dei ruoli disponibili.');
      },
    });
  }

  override onSubmit(): void {

    this.formHelper.form.patchValue({role: this.userRoles.find((role: RoleReadDto) => role.name === this.formHelper.form.value.role)});

    super.onSubmit();
  }
  

  togglePwd(): boolean | null {
    return !this.isLoading.value ? (this.isPasswordVisible = !this.isPasswordVisible) : null;
  }

}
