import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'controllo-ore-x-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  @Input() projectName: string = '';
  @Input() customerName: string = '';
  @Input() color: string = '';

  isPanelOpen: boolean = false;
  customExpandedHeight: string = '90px';

  ngOnInit(): void {
    this.color = this.formatColor();
  }

  formatColor(): string {
    return `#${this.color}`;
  }
}
