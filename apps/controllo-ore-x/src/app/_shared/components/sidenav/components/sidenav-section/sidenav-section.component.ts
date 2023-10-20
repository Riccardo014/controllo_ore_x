import { Component, Input, OnInit } from '@angular/core';
import { IMenuSection } from '@app/_core/interfaces/i-menu-section.interface';

@Component({
  selector: 'controllo-ore-x-sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.scss'],
})
export class SidenavSectionComponent implements OnInit{
  @Input() MENU_SECTIONS!: IMenuSection[];

  @Input() activeSection!: string;

  ngOnInit(): void {
    this.areMenuSectionsValid();
    this.isActiveSectionValid();
  }

  areMenuSectionsValid(): void {
    if (!this.MENU_SECTIONS) {
      throw new Error('MENU_SECTIONS is required');
    }
    for (const section of this.MENU_SECTIONS) {
      if(!section.label || !section.routerLink || !section.iconName) {
        throw new Error('MENU_SECTIONS is not valid');
      }
    }
  }


  isActiveSectionValid(): void {
    if (!this.activeSection) {
      throw new Error('activeSection is required');
    }
    if(typeof this.activeSection !== 'string') {
      throw new Error('activeSection must be a string');
    }
  }

}
