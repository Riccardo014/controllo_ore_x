import { Route } from '@angular/router';
import { CoxUnauthGuard } from '@core/guards/cox-unauth.guard';
import { AuthGuard } from '@core/guards/cox-auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: (): any =>
      import('./modules/unauth/unauth.module').then((m) => m.UnauthModule),
    canActivate: [CoxUnauthGuard],
  },
  {
    path: 'auth',
    loadChildren: (): any =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
];
