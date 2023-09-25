import { Component, OnInit } from '@angular/core';
import { SidenavService } from './servicies/sidenavservice.service';

@Component({
  selector: 'controllo-ore-x-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit{

  isSidenavOpen: boolean = true;

  constructor(private _sidenavService: SidenavService) {}

  ngOnInit(): void {
    this._sidenavService.visibiliyObservable.subscribe(isOpen => this.isSidenavOpen = isOpen);
  }

}
