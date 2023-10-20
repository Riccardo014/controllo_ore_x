import { IMenuSection } from '@app/_core/interfaces/i-menu-section.interface';

export const MANAGEMENT_MENU_SECTIONS: IMenuSection[] = [
  {
    label: 'Progetti',
    routerLink: 'projects',
    iconName: 'egg',
  },
  {
    label: 'Clienti',
    routerLink: 'customers',
    iconName: 'bakery_dining',
  },
  {
    label: 'Team',
    routerLink: 'team',
    iconName: 'workspaces',
  },
  {
    label: 'Etichette',
    routerLink: 'labels',
    iconName: 'sports_tennis',
  },
  {
    label: 'Etichette',
    routerLink: 'settings',
    iconName: 'robot',
  },
];
