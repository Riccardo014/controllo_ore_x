import { Component, OnInit } from '@angular/core';
import { NavMenusVisibilityService } from '../sidenav/servicies/nav-menus-visibility.service';

@Component({
  selector: 'controllo-ore-x-global-topbar',
  templateUrl: './global-topbar.component.html',
  styleUrls: ['./global-topbar.component.scss'],
})
export class GlobalTopbarComponent implements OnInit {
  current_time = '11:20';

  isSidenavOpen: boolean = true;

  constructor(private _sidenavService: NavMenusVisibilityService) {}

  ngOnInit(): void {
    this._sidenavService.visibiliyObservable.subscribe(
      (isOpen) => (this.isSidenavOpen = isOpen),
    );
  }

  toggleVisibility(): void {
    this._sidenavService.toggleVisibility();
  }
}
