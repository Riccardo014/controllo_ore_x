import { IMainMenuVoice } from '@core/interfaces/i-main-menu-voice.interface';

export const MANAGEMENT_MENU: IMainMenuVoice[] = [
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
