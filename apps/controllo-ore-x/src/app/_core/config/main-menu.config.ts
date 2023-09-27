import { IMainMenuVoice } from '@core/interfaces/i-main-menu-voice.interface';

export const MAIN_MENU: IMainMenuVoice[] = [
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
