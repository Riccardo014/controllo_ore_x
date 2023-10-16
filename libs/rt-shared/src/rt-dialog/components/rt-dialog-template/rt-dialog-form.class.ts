import { Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RT_FORM_ERRORS, RtFormError } from 'libs/utils';
import { RtDialog } from './rt-dialog.class';

@Directive()
export abstract class RtDialogForm extends RtDialog {
  abstract title: string;
  protected abstract _formBuilder: FormBuilder;

  RT_FORM_ERRORS: { [key: string]: RtFormError } = RT_FORM_ERRORS;
}
