import { Component, Input } from '@angular/core';
import { IMenuSection } from '@app/_core/interfaces/i-menu-section.interface';

@Component({
  selector: 'controllo-ore-x-sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.scss'],
})
export class SidenavSectionComponent {
  @Input() MENU_SECTIONS!: IMenuSection[];

  @Input() activeSection!: string;
}
