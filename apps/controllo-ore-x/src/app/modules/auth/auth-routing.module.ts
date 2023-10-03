import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from '@modules/auth/pages/dashboard/dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'tracker',
        loadChildren: () =>
          import('./modules/tracker/tracker.module').then(
            (module) => module.TrackerModule,
          ),
      },
      {
        path: 'team',
        loadChildren: () =>
          import('./modules/team/team.module').then(
            (module) => module.TeamModule,
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
