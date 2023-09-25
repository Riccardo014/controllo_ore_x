import { Route } from '@angular/router';
import { authFunctionalGuard, unauthFunctionalGuard } from './_core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: (): any =>
      import('./modules/unauth/unauth.module').then((m) => m.UnauthModule),
    canActivate: [unauthFunctionalGuard],
  },
  {
    path: 'auth',
    loadChildren: (): any =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [authFunctionalGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
];
