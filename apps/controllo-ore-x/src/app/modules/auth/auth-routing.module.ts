import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from '@modules/auth/pages/dashboard/dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: '',
        redirectTo: 'tracker',
        pathMatch: 'full',
      },
      {
        path: 'tracker',
        loadChildren: () =>
          import('./modules/tracker/tracker.module').then(
            (module) => module.TrackerModule,
          ),
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./modules/report/report.module').then(
            (module) => module.ReportModule,
          ),
      },
      {
        path: 'team',
        loadChildren: () =>
          import('./modules/team/team.module').then(
            (module) => module.TeamModule,
          ),
      },
      {
        path: 'clienti',
        loadChildren: () =>
          import('./modules/customer/customer.module').then(
            (module) => module.CustomerModule,
          ),
      },
      {
        path: 'progetti',
        loadChildren: () =>
          import('./modules/project/project.module').then(
            (module) => module.ProjectModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
