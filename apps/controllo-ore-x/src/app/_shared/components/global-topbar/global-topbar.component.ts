import { Component, Input } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-global-topbar',
  templateUrl: './global-topbar.component.html',
  styleUrls: ['./global-topbar.component.scss'],
})
export class GlobalTopbarComponent {

  current_time = "11:20";


  @Input() isMenuButtonShown: boolean = true;

  toggleSidebar(): void {

  }

}
