/**
 * @version 1.0.0
 *
 * Snippet Name: RT Dialog Component
 * Summary: Angular component
 * Description: used by RtDialogService to set the template of all the dialogs
 *
 * File Changelog
 *
 * Author                       | Date            | Changes
 * =====================================================================================================================
 * Luca Bertolini               | 02/04/2021      | Initial Import
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cox-dialog-template',
  templateUrl: './rt-dialog-template.component.html',
  styleUrls: ['./rt-dialog-template.component.scss'],
})
export class RtDialogTemplateComponent {
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;

  @Input() hasHeader: boolean = true;
  @Input() hasFooter: boolean = true;

  @Input() title: string | undefined;
  @Input() subtitle: string | undefined;

  @Output() reFetch: EventEmitter<void> = new EventEmitter<void>();
}
