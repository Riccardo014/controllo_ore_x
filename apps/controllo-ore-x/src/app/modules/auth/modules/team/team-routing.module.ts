import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamUpsertPage } from './dialogs/team-upsert/team-upsert.page';
import { TeamIndexPage } from './pages/team-index.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TeamIndexPage,
  },
  {
    path: 'create',
    component: TeamUpsertPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
