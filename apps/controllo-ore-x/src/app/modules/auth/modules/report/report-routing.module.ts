import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportIndexPage } from './pages/report-index/report-index.page';

const routes: Routes = [
  {
    path: '',
    component: ReportIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}

