import { Route } from '@angular/router';
import { isUserLoggedIn, isUserNotLoggedIn } from './_core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: (): any =>
      import('./modules/unauth/unauth.module').then(
        (module) => module.UnauthModule,
      ),
    canActivate: [isUserNotLoggedIn],
  },
  {
    path: 'auth',
    loadChildren: (): any =>
      import('./modules/auth/auth.module').then((module) => module.AuthModule),
    canActivate: [isUserLoggedIn],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
];
