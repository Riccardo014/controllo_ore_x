import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectIndexPage } from './pages/project-index.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectIndexPage,
  },
  // TODO: add route for project upsert
  // {
  //   path: 'create',
  //   component: ProjectUpsertPage,
  // },
  // {
  //   path: ':id',
  //   component: ProjectUpsertPage,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
