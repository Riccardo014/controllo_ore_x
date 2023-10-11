import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReleaseUpsertPage } from './dialogs/release-upsert/release-upsert.page';
import { ReleaseIndexPage } from './pages/release-index/release-index.page';
import { ReportIndexPage } from './pages/report-index/report-index.page';

const routes: Routes = [
  {
    path: '',
    component: ReleaseIndexPage,
  },
  {
    path: 'create',
    component: ReleaseUpsertPage,
  },
  {
    path: ':id',
    component: ReleaseUpsertPage,
  },
  {
    path: 'report/:id',
    component: ReportIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReleaseRoutingModule {}
