import { Component } from '@angular/core';
import { RtLoadingService } from '../../services/rt-loading.service';

@Component({
  selector: 'lib-rt-loading',
  templateUrl: './rt-loading.component.html',
  styleUrls: ['./rt-loading.component.scss'],
})
export class RtLoadingComponent {
  constructor(public loadingSvc: RtLoadingService) {}
}
