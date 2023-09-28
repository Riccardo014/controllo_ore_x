import { Component } from '@angular/core';
import { RtLoadingService } from '../../services/rt-loading.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lib-rt-loading',
  templateUrl: './rt-loading.component.html',
  styleUrls: [
    './rt-loading.component.scss',
  ],
})
export class RtLoadingComponent {
  constructor(public loadingSvc: RtLoadingService) { }
}

