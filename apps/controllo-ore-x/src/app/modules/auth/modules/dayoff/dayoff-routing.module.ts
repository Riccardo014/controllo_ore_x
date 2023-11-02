import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayoffIndexPage } from './pages/dayoff-index/dayoff-index.page';

const routes: Routes = [
  {
    path: '',
    component: DayoffIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayoffRoutingModule {}
