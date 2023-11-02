import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-rt-dialog-default-actions',
  templateUrl: './rt-dialog-default-actions.component.html',
  styleUrls: ['./rt-dialog-default-actions.component.scss'],
})
export class RtDialogDefaultActionsComponent {
  @Input() textConfirm: string = 'Salva';
  @Input() textCancel: string = 'Annulla';
  @Input() isValid?: boolean;

  @Output() confirmEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>();
}
