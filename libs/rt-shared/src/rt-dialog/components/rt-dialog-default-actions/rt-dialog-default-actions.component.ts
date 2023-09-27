/**
 * @version 1.0.0
 *
 * Snippet Name: RT Dialog Default Actions Component
 * Summary: Angular component to use inside dialogTemplate
 * Description: used inside RtDialogTemplate to display a basic footer, with basic actions
 *
 * File Changelog
 *
 * Author                       | Date            | Changes
 * =====================================================================================================================
 * Luca Bertolini               | 02/04/2021      | Initial Import
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'rt-dialog-default-actions',
  templateUrl: './rt-dialog-default-actions.component.html',
  styleUrls: [
    './rt-dialog-default-actions.component.scss',
  ],
})
export class RtDialogDefaultActionsComponent {
  @Input() textConfirm: string = 'Ok';
  @Input() textCancel: string = 'Annulla';

  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
}
