import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerIndexPage } from './pages/tracker-index/tracker-index.page';
import { TrackerUpsertPage } from './dialogs/tracker-upsert/tracker-upsert.page';

const routes: Routes = [
  {
    path: '',
    component: TrackerIndexPage,
  },
  {
    path: 'create',
    component: TrackerUpsertPage,
  },
  {
    path: ':id',
    component: TrackerUpsertPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackerRoutingModule {}

