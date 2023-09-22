import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';

const screenWidth: number = window.innerWidth;
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: screenWidth > 768 ? 'accedi' : 'accedi',
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
