import { Route } from '@angular/router';
import { UnauthGuard } from '@app/_core/guards/unauth.guard';
import { AuthGuard } from '@core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: (): any =>
      import('./modules/unauth/unauth.module').then((m) => m.UnauthModule),
    canActivate: [UnauthGuard],
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
