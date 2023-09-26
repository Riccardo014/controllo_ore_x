import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalTopbarComponent } from './components/global-topbar/global-topbar.component';
import { MatChipsModule } from '@angular/material/chips';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule,
  ],
  exports: [
    GlobalTopbarComponent,
    SidenavComponent,
  ],
})
export class SharedModule {}
