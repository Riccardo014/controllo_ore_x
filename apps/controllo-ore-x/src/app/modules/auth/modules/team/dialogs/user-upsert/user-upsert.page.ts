import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCreateDto, UserReadDto, UserUpdateDto } from '@api-interfaces';
import { UserDataService } from '@app/_core/services/user-data.service';
import { UpsertPage } from '@app/_shared/classes/upsert-page.class';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RtDialogService } from 'libs/rt-shared/src/rt-dialog/services/rt-dialog.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { UserFormHelper } from '../../helpers/user.form-helper';

@Component({
  selector: 'controllo-ore-x-user-upsert',
  templateUrl: './user-upsert.page.html',
  styleUrls: ['./user-upsert.page.scss'],
  providers: [UserFormHelper],
})
export class UserUpsertPage extends UpsertPage<
  UserReadDto,
  UserCreateDto,
  UserUpdateDto
> {
  override title: string = 'Nuovo membro';

  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  constructor(
    public override formHelper: UserFormHelper,
    private _userDataService: UserDataService,
    private _alertService: AlertService,
    private _rtDialogService: RtDialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(
      formHelper,
      _alertService,
      _rtDialogService,
      _router,
      _activatedRoute,
    );
  }
}
