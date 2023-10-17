import { Component } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-project-activity-card',
  templateUrl: './project-activity-card.component.html',
  styleUrls: ['./project-activity-card.component.scss'],
})
export class ProjectActivityCardComponent {
  tagIcon = 'draw_collage';
  tagName = 'Design';
  numberOfHours = 10;
}
