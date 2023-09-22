import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerTableLineComponent } from './components/tracker-table-line/tracker-table-line.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TrackerTableLineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackerRoutingModule {}

