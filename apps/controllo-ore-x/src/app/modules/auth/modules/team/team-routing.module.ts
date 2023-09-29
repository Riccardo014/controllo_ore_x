import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamUpsertPage } from './dialogs/team-upsert/team-upsert.page';
import { TeamIndexPage } from './pages/team-index.page';
import { TeamEditUpsertPage } from './dialogs/team-edit-upsert/team-edit-upsert.page';

const routes: Routes = [
  {
    path: '',
    component: TeamIndexPage,
  },
  {
    path: 'create',
    component: TeamUpsertPage,
  },
  {
    path: ':id',
    component: TeamEditUpsertPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
