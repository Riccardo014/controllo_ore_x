import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-dialog-template',
  templateUrl: './rt-dialog-template.component.html',
  styleUrls: ['./rt-dialog-template.component.scss'],
})
export class RtDialogTemplateComponent {
  @Output() closeDialogEvent: EventEmitter<void> = new EventEmitter<void>();

  @Input() cTitle: string | undefined;
  @Input() subtitle: string | undefined;
  @Input() isFooterEnabled: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() errorMsg?: string = 'Si è verificato un errore. Riprova';
  @Input() hasClose: boolean = false;
}
