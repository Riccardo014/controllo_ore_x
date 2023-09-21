import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from '@modules/auth/pages/dashboard/dashboard.page';
import { ProjectsReleaseTableLineComponent } from './modules/projects/components/projects-release-table-line/projects-release-table-line.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'report-table-line',
        //loadChildren: () => import('./modules/projects/components/projects-release-table-line/projects-release-table-line.component').then((m) => m.ProjectsReleaseTableLineComponent),
        pathMatch: 'full',
        component: ProjectsReleaseTableLineComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
