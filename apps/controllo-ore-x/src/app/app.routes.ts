import { Route } from '@angular/router';
import { CoxUnauthGuard } from '@core/guards/cox-unauth.guard';
import { CoxAuthGuard } from '@core/guards/cox-auth.guard';
import { CustomerTableLineComponent } from './modules/auth/modules/customer/components/customer-table-line/customer-table-line.component';

export const appRoutes: Route[] = [

  {
    path: '',
    loadChildren: (): any => import('./modules/unauth/unauth.module').then((m) => m.UnauthModule),
    canActivate: [CoxUnauthGuard],
  },
  {
    path: 'auth',
    loadChildren: (): any => import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [CoxAuthGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
];
