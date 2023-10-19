import { Component, ElementRef, forwardRef, Injector, Input, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectControlValueAccessorConnector } from '../../shared/class/select-control-value-accessor-connector';

@Component({
  selector: 'lib-rt-select',
  templateUrl: './rt-select.component.html',
  styleUrls: ['./rt-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RtSelectComponent),
      multi: true
    }
  ]
})
export class RtSelectComponent extends SelectControlValueAccessorConnector {

  @Input() label?: string;
  @Input() hint?: string;
  @Input() containerClass: string = '';
  @Input() inputPlaceholder: string = '';
  @Input() inputClass: string = '';
  @Input() errorsToWatch: { name: string, message: string }[] = [];
  @Input() options: any[] = [];
  
  constructor(_renderer: Renderer2, _elementRef: ElementRef, injector: Injector) {
    super(_renderer, _elementRef, injector);
  }

  // Function to set the label shown on the select
  @Input() selectOptionLabelFn: (value: any) => string = value => value;

}
