import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReleaseIndexPage } from './pages/release-index/release-index.page';
import { ReportIndexPage } from './pages/report-index/report-index.page';

const routes: Routes = [
  {
    path: '',
    component: ReleaseIndexPage,
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
