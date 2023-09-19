import { Component } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent {

  title = 'Progetti';
  button_icon = 'egg';
  button_text = 'Nuovo Progetto';

}
