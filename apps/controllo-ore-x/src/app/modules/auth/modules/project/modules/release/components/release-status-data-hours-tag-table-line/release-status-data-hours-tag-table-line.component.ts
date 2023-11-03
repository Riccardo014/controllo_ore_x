import { Component, Input, OnInit } from '@angular/core';
import { HoursTagReadDto } from '@api-interfaces';
import { convertNumberToHours } from '@app/utils/NumberToHoursConverter';

@Component({
  selector: 'controllo-ore-x-release-status-data-hours-tag-table-line',
  templateUrl: './release-status-data-hours-tag-table-line.component.html',
  styleUrls: ['./release-status-data-hours-tag-table-line.component.scss'],
})
export class ReleaseStatusDataHoursTagTableLineComponent implements OnInit {
  @Input() hoursTag!: HoursTagReadDto;
  @Input() hours!: number;
  @Input() totalHours!: number;

  ngOnInit(): void {
    if (!this.hoursTag) {
      throw new Error('hoursTag is required');
    }
    if (!this.hours) {
      throw new Error('hours is required');
    }
    if (!this.totalHours) {
      throw new Error('totalHours is required');
    }
  }

  convertNumberToHours(hoursToConvert: number): string {
    return convertNumberToHours(hoursToConvert);
  }
}
