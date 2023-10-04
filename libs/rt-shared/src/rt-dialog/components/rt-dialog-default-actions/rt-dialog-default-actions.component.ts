import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Display a basic footer, with basic actions, in a RtDialogTemplate
 */
@Component({
  selector: 'rt-dialog-default-actions',
  templateUrl: './rt-dialog-default-actions.component.html',
  styleUrls: ['./rt-dialog-default-actions.component.scss'],
})
export class RtDialogDefaultActionsComponent {
  @Input() textConfirm: string = 'Ok';
  @Input() textCancel: string = 'Annulla';

  @Output() confirmEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
}
