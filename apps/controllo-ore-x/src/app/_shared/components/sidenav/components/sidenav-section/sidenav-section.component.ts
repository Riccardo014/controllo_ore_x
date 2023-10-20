import { Component, Input } from '@angular/core';
import { IMenuSections } from '@app/_core/interfaces/i-menu-sections.interface';

@Component({
  selector: 'controllo-ore-x-sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.scss'],
})
export class SidenavSectionComponent {
  @Input() MENU_SECTIONS!: IMenuSections[];

  @Input() activeSection!: string;
}
