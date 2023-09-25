import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accedi',
    //TODO: scherata per ipad e cellulare
    //redirectTo: screenWidth > 768 ? 'accedi' : 'benvenuto',
  },
  {
    path: 'accedi',
    component: LoginPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class UnauthRoutingModule { }
