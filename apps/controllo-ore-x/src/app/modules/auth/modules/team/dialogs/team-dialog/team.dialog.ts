import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ApiPaginatedResponse,
  RoleReadDto,
  UserReadDto,
} from '@api-interfaces';
import { RoleDataService } from '@app/_core/services/role.data-service';
import { TeamDataService } from '@app/_core/services/team.data-service';
import { strongPasswordValidator } from '@app/_shared/validators/strong-password.validator';
import {
  SubscriptionsLifecycle,
  completeSubscriptions,
} from '@app/utils/subscriptions_lifecycle';
import {
  IRtDialogClose,
  IRtDialogInput,
  RT_DIALOG_CLOSE_RESULT,
  RtDialogService,
} from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-team-dialog',
  templateUrl: './team.dialog.html',
  styleUrls: ['./team.dialog.scss'],
})
export class TeamDialog implements SubscriptionsLifecycle, OnDestroy, OnInit {
  title: string = 'Crea nuovo membro';
  isPasswordVisible: boolean = false;
  transactionStatus: 'create' | 'update' = 'create';
  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = '';

  user?: UserReadDto;

  userFormGroup: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    surname: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    role: new FormControl(null, Validators.required),
  });

  userRoles: RoleReadDto[] = [];

  subscriptionsList: Subscription[] = [];

  completeSubscriptions: (subscriptionsList: Subscription[]) => void =
    completeSubscriptions;

  constructor(
    private _teamDataService: TeamDataService,
    public dialogRef: MatDialogRef<TeamDialog>,
    private _alertService: AlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: IRtDialogInput<UserReadDto>,
    private _rtDialogService: RtDialogService,

    protected _formBuilder: FormBuilder,
    private _roleDataService: RoleDataService,
  ) {
    if (!this.data.input) {
      this._setCreationMode();
      return;
    }
    this.transactionStatus = 'update';
    this.title = 'Modifica membro';
    this.user = this.data.input;
    this.userFormGroup.patchValue(this.data.input);
  }

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions(this.subscriptionsList);
  }

  setSubscriptions(): void {
    this.subscriptionsList.push(this._getUsersRoles());
  }

  onDelete(): void {
    this._rtDialogService
      .openConfirmation(
        "Procedere con l'eliminazione?",
        "L'operazione non è reversibile",
      )
      .subscribe({
        next: (res) => {
          if (res?.result === RT_DIALOG_CLOSE_RESULT.CONFIRM) {
            this._delete();
          }
        },
        error: (error: any) => {
          throw new Error(error);
        }
      });
  }

  onCancel(): void {
    const modalRes: IRtDialogClose = {
      result: RT_DIALOG_CLOSE_RESULT.CANCEL,
    };
    this.dialogRef.close(modalRes);
  }

  onSubmit(): void {
    this.hasErrors = false;

    if (this.transactionStatus === 'update') {
      this._update();
      return;
    }

    this._create();
  }

  onReFetch(): void {
    window.location.reload();
  }

  getFormControlError(field: string, error: Error): boolean {
    return this.userFormGroup.controls[field].hasError(error.name);
  }

  compareRoleFn(x: RoleReadDto, y: RoleReadDto): boolean {
    return x?._id === y?._id;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Set the form in creation mode, adding the password field.
   */
  private _setCreationMode(): void {
    this.userFormGroup.addControl(
      'password',
      this._formBuilder.control(null, [
        Validators.required,
        strongPasswordValidator,
      ]),
    );
  }

  private _create(): void {
    const userDto: UserReadDto & { password: string } =
      this.userFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._teamDataService.create(userDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this.errorMessage = 'Non è stato possibile creare l\'utente';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _update(): void {
    if (!this.user || this.transactionStatus === 'create') {
      return;
    }

    const userId: string = this.user._id;
    const userDto: UserReadDto = this.userFormGroup.getRawValue();

    this.isLoading = true;
    this.hasErrors = false;
    this._teamDataService.update(userId, userDto).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this.errorMessage = 'Non è stato possibile aggiornare i dati dell\'utente';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private _delete(): void {
    if (!this.user) {
      return;
    }

    const userId: string = this.user._id;

    this.isLoading = true;
    this.hasErrors = false;
    this._teamDataService.delete(userId).subscribe({
      next: () => {
        this._alertService.openSuccess();
        const modalRes: IRtDialogClose = {
          result: RT_DIALOG_CLOSE_RESULT.CONFIRM,
        };
        this.dialogRef.close(modalRes);
      },
      error: () => {
        this.errorMessage = 'Non è stato possibile eliminare l\'utente';
        this.hasErrors = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Fetch and set the users' roles from the database.
   */
  private _getUsersRoles(): Subscription {
    return this._roleDataService.getMany({}).subscribe({
      next: (roles: ApiPaginatedResponse<RoleReadDto>) => {
        this.userRoles = roles.data;
      },
      error: (error: any) => {
        throw new Error(error);
      },
    });
  }
}
