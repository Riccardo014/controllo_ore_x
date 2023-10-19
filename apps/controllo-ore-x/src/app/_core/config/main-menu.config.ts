import { IMenuSections } from '@app/_core/interfaces/i-menu-sections.interface';

export const MAIN_MENU: IMenuSections[] = [
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
