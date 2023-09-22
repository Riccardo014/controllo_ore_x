import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalTopbarComponent } from './components/global-topbar/global-topbar.component';
import { MatChipsModule } from '@angular/material/chips';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    GlobalTopbarComponent,
    SidenavComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatChipsModule,
    MatMenuModule,
  ],
  exports: [
    GlobalTopbarComponent,
    SidenavComponent,
  ],
})
export class SharedModule {}
