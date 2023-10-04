import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Set the template of all the dialogs, it's used in RtDialogService
 */
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

  @Output() reFetchEmitter: EventEmitter<void> = new EventEmitter<void>();
}
