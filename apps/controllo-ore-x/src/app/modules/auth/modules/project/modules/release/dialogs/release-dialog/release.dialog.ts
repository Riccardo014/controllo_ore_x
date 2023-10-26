import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ReleaseCreateDto,
  ReleaseReadDto,
  ReleaseUpdateDto,
} from '@api-interfaces';
import { BaseDialog } from '@app/_shared/classes/base-dialog.class';
import { IRtDialogInput, RtDialogService } from '@controllo-ore-x/rt-shared';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { ReleaseFormHelper } from '../../helpers/release.form-helper';

@Component({
  selector: 'controllo-ore-x-release-dialog',
  templateUrl: './release.dialog.html',
  styleUrls: ['./release.dialog.scss'],
  providers: [ReleaseFormHelper],
})
export class ReleaseDialog
  extends BaseDialog<ReleaseReadDto, ReleaseCreateDto, ReleaseUpdateDto>
  implements OnInit
{
  override title: string = 'Crea nuova release';

  constructor(
    public override formHelper: ReleaseFormHelper,
    protected override _formBuilder: FormBuilder,
    protected _matDialogRef: MatDialogRef<ReleaseDialog>,
    private _rtDialogService: RtDialogService,
    private _alertService: AlertService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
  ) {
    super(formHelper, _formBuilder, _rtDialogService, _alertService, _router);
  }

  ngOnInit(): void {
    if (this.data.input.transactionStatus === 'create') {
      this.formHelper.form.patchValue({
        projectId: this.data.input._id,
        isCompleted: false,
      });
      return;
    }
    if (this.data.input) {
      this.transactionStatus = 'update';
      this.formHelper.patchForm(this.data.input);
      this.formHelper.entityId = this.data.input._id;
      this.title = 'Modifica release';
    }
  }

  override onSubmit(): void {
    super.onSubmit();
    window.location.reload();
  }

  override navigateBackToIndex(): void {
    window.location.reload();
  }
}
