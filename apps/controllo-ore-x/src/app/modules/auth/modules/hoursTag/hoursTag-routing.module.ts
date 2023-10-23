import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HoursTagIndexPage } from './pages/hoursTag-index.page';

const routes: Routes = [
  {
    path: '',
    component: HoursTagIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoursTagRoutingModule {}
