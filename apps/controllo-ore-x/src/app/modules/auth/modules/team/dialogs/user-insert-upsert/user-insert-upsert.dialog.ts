import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IRtWrapBase, RoleReadDto, UserCreateDto } from '@api-interfaces';
import { RoleDataService } from '@app/_core/services/role-data.service';
import { UserDataService } from '@app/_core/services/user-data.service';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import { RT_DIALOG_CLOSE_RESULT } from 'libs/rt-shared/src/rt-dialog/enums/rt-dialog-close-result.enum';
import { IRtDialogClose } from 'libs/rt-shared/src/rt-dialog/interfaces/i-rt-dialog-close.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-user-insert-upsert',
  templateUrl: './user-insert-upsert.dialog.html',
  styleUrls: ['./user-insert-upsert.dialog.scss'],
})
export class UserInsertUpsertDialog implements SubscriptionsLifecycle {
  title: string = 'Aggiungi un nuovo membro';
  icon: string = 'arrow_back';

  isLoading: boolean = false;
  hasErrors: boolean = false;

  hasFormErrors: boolean = false;

  roles: RoleReadDto[] = [];

  newUserFormGroup: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    surname: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    role: new FormControl(null, Validators.required),
  });

  subscriptionsList: Subscription[] = [];

  _completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    public dialogRef: MatDialogRef<UserInsertUpsertDialog>,
    private _userDataService: UserDataService,
    private _roleDataService: RoleDataService,
  ) {}

  ngOnInit(): void {
    this._setSubscriptions();
  }

  ngOnDestroy(): void {
    this._completeSubscriptions(this.subscriptionsList);
  }

  _setSubscriptions(): void {
    this.subscriptionsList.push(
      this._roleDataService.getManyFb({}).subscribe({
        next: (res: IRtWrapBase<RoleReadDto[]>) => {
          this.roles = res.data;
        },
        error: () => {
          this.hasErrors = true;
        },
      }),
    );
  }

  navigateBack(): void {
    const modalRes: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CANCEL,
    };
    this.dialogRef.close(modalRes);
  }

  sendData(): void {
    this.hasErrors = false;

    this._create();
  }

  private _create(): void {
    const newUser: UserCreateDto = this._buildUserDto();

    this.isLoading = true;
    this._userDataService.create(newUser).subscribe({
      next: () => {
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _buildUserDto(): UserCreateDto {
    this.isLoading = true;

    const formResult = this.newUserFormGroup.getRawValue();

    const newUser: UserCreateDto = {
      name: formResult.name,
      surname: formResult.surname,
      email: formResult.email,
      password: 'Password1!',
      roleId: formResult.role._id,
    };
    return newUser;
  }
}
