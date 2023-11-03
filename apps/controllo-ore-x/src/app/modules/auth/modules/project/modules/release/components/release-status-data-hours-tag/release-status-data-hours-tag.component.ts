import { Component, Input, OnInit } from '@angular/core';
import { HoursTagReadDto } from '@api-interfaces';

@Component({
  selector: 'controllo-ore-x-release-status-data-hours-tag',
  templateUrl: './release-status-data-hours-tag.component.html',
  styleUrls: ['./release-status-data-hours-tag.component.scss'],
})
export class ReleaseStatusDataHoursTagComponent implements OnInit {
  @Input() tagWithHours!: {
    hoursTag: HoursTagReadDto;
    hours: number;
  }[];

  @Input() totalHours!: number;

  ngOnInit(): void {
    if (!this.tagWithHours) {
      throw new Error('tagWithHours are required');
    }
    if (!this.totalHours) {
      throw new Error('totalHours is required');
    }
  }
}
