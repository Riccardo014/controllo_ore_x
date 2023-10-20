import { IMenuSection } from '@app/_core/interfaces/i-menu-section.interface';

export const MANAGEMENT_MENU_SECTIONS: IMenuSection[] = [
  {
    label: 'Progetti',
    routerLink: 'progetti',
    iconName: 'egg',
  },
  {
    label: 'Clienti',
    routerLink: 'clienti',
    iconName: 'bakery_dining',
  },
  {
    label: 'Team',
    routerLink: 'team',
    iconName: 'workspaces',
  },
  {
    label: 'Etichette',
    routerLink: 'etichette',
    iconName: 'sports_tennis',
  },
  {
    label: 'Impostazioni',
    routerLink: 'impostazioni',
    iconName: 'robot',
  },
];
