import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RtInputComponent} from './components/rt-input/rt-input.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [RtInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    RtInputComponent
  ]
})
export class RtInputModule {
}
