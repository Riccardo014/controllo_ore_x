import { IMenuSections } from '@app/_core/interfaces/i-menu-sections.interface';

export const MANAGEMENT_MENU: IMenuSections[] = [
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
