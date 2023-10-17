import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamIndexPage } from './pages/team-index.page';

const routes: Routes = [
  {
    path: '',
    component: TeamIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
