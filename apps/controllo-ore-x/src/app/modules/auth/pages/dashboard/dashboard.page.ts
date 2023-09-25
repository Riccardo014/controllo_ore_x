import { Component, OnInit } from '@angular/core';
import { NavMenusVisibilityService } from 'apps/controllo-ore-x/src/app/_shared/components/sidenav/servicies/nav-menus-visibility.service';

@Component({
  selector: 'controllo-ore-x-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isSidebarOpen: boolean = true;

  constructor(private _sidenavService: NavMenusVisibilityService) {}

  ngOnInit(): void {
    this._sidenavService.areMenusVisibile.subscribe(
      (isOpen) => (this.isSidebarOpen = isOpen),
    );
  }
}
