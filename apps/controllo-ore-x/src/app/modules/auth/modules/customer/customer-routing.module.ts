import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerIndexPage } from './pages/customer-index.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerIndexPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
