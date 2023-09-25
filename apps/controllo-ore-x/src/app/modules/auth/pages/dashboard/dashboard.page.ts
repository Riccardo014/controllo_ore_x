import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'apps/controllo-ore-x/src/app/_shared/components/sidenav/servicies/sidenavservice.service';

@Component({
  selector: 'controllo-ore-x-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isSidebarOpen: boolean = true;

  constructor(private _sidenavService: SidenavService) {}

  ngOnInit(): void {
    this._sidenavService.areMenusVisibile.subscribe(
      (isOpen) => (this.isSidebarOpen = isOpen),
    );
  }
}
