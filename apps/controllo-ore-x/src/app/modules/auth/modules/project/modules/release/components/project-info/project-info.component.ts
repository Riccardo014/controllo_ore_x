import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'controllo-ore-x-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {
  @Input() projectId!: string;

  @Input() wasProjectUpdated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    if (!this.projectId) {
      throw new Error('Project id is required');
    }
  }
}
