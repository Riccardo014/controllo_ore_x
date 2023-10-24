import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent {
  @Input() title: string = 'Title';
  @Input() buttonIcon: string = 'Icon';
  @Input() buttonText: string = 'Button txt';

  @Output() buttonOnClickEvent: EventEmitter<void> = new EventEmitter<void>();

  openDialog(): void {
    this.buttonOnClickEvent.emit();
  }
}
