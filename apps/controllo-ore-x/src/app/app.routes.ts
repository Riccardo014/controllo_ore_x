import { Route } from '@angular/router';
import { isUserLoggedIn, isUserNotLoggedIn } from './_core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: (): any =>
      import('./modules/unauth/unauth.module').then((m) => m.UnauthModule),
    canActivate: [isUserNotLoggedIn],
  },
  {
    path: 'auth',
    loadChildren: (): any =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [isUserLoggedIn],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
];
