import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserUpsertPage } from './dialogs/user-upsert/user-upsert.page';
import { TeamIndexPage } from './pages/team-index.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TeamIndexPage,
  },
  {
    path: 'create',
    component: UserUpsertPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
