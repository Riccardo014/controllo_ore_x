import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectUpsertPage } from './dialogs/project-upsert/project-upsert.page';
import { ProjectIndexPage } from './pages/project-index/project-index.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectIndexPage,
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
