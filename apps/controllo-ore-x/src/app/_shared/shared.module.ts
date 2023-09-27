import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalTopbarComponent } from './components/global-topbar/global-topbar.component';
import { MatChipsModule } from '@angular/material/chips';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    GlobalTopbarComponent,
    SidenavComponent,
    PageTitleComponent,
    SearchBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatChipsModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  exports: [
    GlobalTopbarComponent,
    SidenavComponent,
    PageTitleComponent,
    SearchBarComponent,
  ],
})
export class SharedModule {}
