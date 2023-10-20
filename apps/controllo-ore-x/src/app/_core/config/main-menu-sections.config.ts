import { IMenuSection } from '@app/_core/interfaces/i-menu-section.interface';

export const MAIN_MENU_SECTIONS: IMenuSection[] = [
  {
    label: 'Tracker',
    routerLink: 'tracker',
    iconName: 'screen_record',
  },
  {
    label: 'Ferie e Permessi',
    routerLink: 'dayoffs',
    iconName: 'carpenter',
  },
];
