import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../sidenav/servicies/sidenavservice.service';

@Component({
  selector: 'controllo-ore-x-global-topbar',
  templateUrl: './global-topbar.component.html',
  styleUrls: ['./global-topbar.component.scss'],
})
export class GlobalTopbarComponent implements OnInit {
  current_time = '11:20';

  isSidenavOpen: boolean = true;

  constructor(private _sidenavService: SidenavService) {}

  ngOnInit(): void {
    this._sidenavService.currentSidebarStatus.subscribe(
      (isOpen) => (this.isSidenavOpen = isOpen),
    );
  }

  toggleVisibility(): void {
    this._sidenavService.toggleVisibility();
  }
}
