import { Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '../../classes/control-value-accessor-connector.class';
import { RtErrorStateMatcher } from '../../classes/rt-error-state-matcher.class';

@Component({
  selector: 'lib-rt-input',
  templateUrl: './rt-input.component.html',
  styleUrls: ['./rt-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RtInputComponent,
      multi: true,
    },
  ],
})
export class RtInputComponent extends ControlValueAccessorConnector {
  @Input() label?: string;
  @Input() containerClass: string = '';
  @Input() inputPlaceholder: string = '';
  @Input() inputClass: string = '';
  @Input() errorsToWatch: { name: string; message: string }[] = [];
  @Input() inputType: 'number' | 'text' | 'password' | 'email' = 'text';
  @Input() inputName: string = '';
  @Input() autocomplete?: string;
  @Input() hint?: string;
  @Input() maxlength: number | null = null;
  @Input() stepValue: string = '0.01';

  matcher: RtErrorStateMatcher = new RtErrorStateMatcher();
  isDisabled: boolean = false;

  constructor(injector: Injector) {
    super(injector);
  }

  @Input()
  set disabled(value: boolean) {
    if (value) {
      this.setDisabledState(value);
      this.isDisabled = value;
    }
  }
}
