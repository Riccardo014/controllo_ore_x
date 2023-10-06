import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectIndexPage } from './pages/project-index/project-index.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectIndexPage,
  },
  {
    path: ':projectId/release',
    loadChildren: () =>
      import('./modules/release/release.module').then(
        (module) => module.ReleaseModule,
      ),
  },
  {
    path: ':id/release',
    loadChildren: () =>
      import('./modules/release/release.module').then((module) => module.ReleaseModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
