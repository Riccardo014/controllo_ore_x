import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  HoursTagCreateDto,
  HoursTagReadDto,
  HoursTagUpdateDto,
} from '@api-interfaces';
import { HoursTagDataService } from '@app/_core/services/hours-tag.data-service';
import { BaseDialog } from '@app/_shared/classes/base-dialog.class';
import { IRtDialogInput, RtDialogService } from '@controllo-ore-x/rt-shared';
import { HoursTagIcon } from 'apps/controllo-ore-x/src/assets/utils/datas/hoursTag-icon';
import { AlertService } from 'libs/rt-shared/src/alert/services/alert.service';
import { HoursTagFormHelper } from '../../helpers/hoursTag.form-helper';

@Component({
  selector: 'controllo-ore-x-hoursTag-dialog',
  templateUrl: './hoursTag.dialog.html',
  styleUrls: ['./hoursTag.dialog.scss'],
  providers: [HoursTagFormHelper],
})
export class HoursTagDialog
  extends BaseDialog<HoursTagReadDto, HoursTagCreateDto, HoursTagUpdateDto>
  implements OnInit
{
  override title: string = 'Nuova etichetta';

  override isCreating: boolean = true;

  currentIconName?: string;
  icons: string[] = [
    HoursTagIcon.sentiment_stressed,
    HoursTagIcon.draw_collage,
    HoursTagIcon.celebration,
    HoursTagIcon.personal_injury,
    HoursTagIcon.skull,
    HoursTagIcon.stadia_controller,
    HoursTagIcon.sports_soccer,
  ];

  constructor(
    public override formHelper: HoursTagFormHelper,
    protected override _formBuilder: FormBuilder,
    protected _matDialogRef: MatDialogRef<HoursTagDialog>,
    private _hoursTagDataService: HoursTagDataService,
    private _rtDialogService: RtDialogService,
    private _alertService: AlertService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: IRtDialogInput<any>,
  ) {
    super(formHelper, _formBuilder, _rtDialogService, _alertService, _router);
  }

  ngOnInit(): void {
    if (this.data.input) {
      this.isCreating = false;
      this.formHelper.patchForm(this.data.input);
      this.currentIconName = this.data.input.iconName;
      this.formHelper.entityId = this.data.input._id;
      this.title = 'Modifica etichetta';
    }
  }
}
