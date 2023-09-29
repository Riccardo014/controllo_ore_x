import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, IRtWrapBase, RoleReadDto, UserCreateDto, UserReadDto, UserUpdateDto } from '@api-interfaces';
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { TeamFormHelper } from '../../helpers/team.form-helper';
import { Observable, Subscription } from 'rxjs';
import { TeamDataService } from '@app/_core/services/team-data.service';
import { RoleDataService } from '@app/_core/services/role-data.service';
import { SubscriptionsLifecycle, completeSubscriptions } from '@app/utils/subscriptions_lifecycle';

@Component({
  selector: 'controllo-ore-x-team-edit-upsert',
  templateUrl: './team-edit-upsert.page.html',
  styleUrls: ['./team-edit-upsert.page.scss'],
  providers: [TeamFormHelper],
})
export class TeamEditUpsertPage extends UpsertPage<
  UserReadDto,
  UserCreateDto,
  UserUpdateDto
> implements SubscriptionsLifecycle {
  override title: string = 'Modifica membro';

  isPasswordVisible: boolean = false;

  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  userRoles: RoleReadDto[] = [];
  userRole: RoleReadDto | undefined= {} as RoleReadDto;
  availableRoles: string[] = [];
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
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(this._getUser());
  }

  togglePwd(): boolean | null {
    return !this.isLoading.value ? (this.isPasswordVisible = !this.isPasswordVisible) : null;
  }

  override onSubmit(): void {

    this.formHelper.form.patchValue({role: this.userRoles.find((role: RoleReadDto) => role.name === this.formHelper.form.value.role)});

    super.onSubmit();
  }

  private _getUser(): Subscription {
    const userId: string = this._router.url.split('/')[this._router.url.split('/').length - 1];
    return this._teamDataService.getUser(userId).subscribe((user: UserReadDto) => { 
      this.formHelper.form.patchValue(user);
      this.formHelper.form.patchValue({ password: 'Password1!' });
      this._roleDataService.getMany({}).subscribe({
        next: (res: IRtWrapBase<RoleReadDto[]>) => {
          this.userRoles = res.data;
          this.formHelper.form.patchValue({role: this.userRoles.find((role: RoleReadDto) => role._id === user.roleId)});
        },
        error: () => {
          throw new Error('Si è verificato un errore durante l\'ottenimento dei ruoli disponibili.');
        },
      });
    });
  }

}
