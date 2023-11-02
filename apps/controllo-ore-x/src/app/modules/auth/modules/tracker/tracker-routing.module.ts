import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerIndexPage } from './pages/tracker-index/tracker-index.page';

const routes: Routes = [
  {
    path: '',
    component: TrackerIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackerRoutingModule {}
