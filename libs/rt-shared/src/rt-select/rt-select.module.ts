import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RtSelectComponent} from './components/rt-select/rt-select.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectControlValueAccessorConnector} from './shared/class/select-control-value-accessor-connector';

@NgModule({
  declarations: [
    RtSelectComponent,
    SelectControlValueAccessorConnector
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatSelectModule,
    MatFormFieldModule

  ],
  exports: [
    RtSelectComponent
  ]
})
export class RtSelectModule {
}
