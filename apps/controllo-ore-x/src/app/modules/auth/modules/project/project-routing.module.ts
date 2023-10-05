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
    path: 'create',
    component: ProjectUpsertPage,
  },
  {
    path: ':id',
    component: ProjectUpsertPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
