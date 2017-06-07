import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {DynamicFormComponent} from './container/dynamic-form/dynamic-form.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormButtonComponent } from './components/form-button/form-button.component';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { FormAddnameComponent } from './components/form-uniqname/form-uniqname.component';
import { FormIdComponent } from './components/form-id/form-id.component';
import {FormSelectSpecialityComponent} from './components/form-select-speciality/form-select-speciality.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    DynamicFormComponent,
    FormInputComponent,
    FormSelectComponent,
    FormButtonComponent,
    DynamicFieldDirective,
    FormAddnameComponent,
    FormIdComponent,
    FormSelectSpecialityComponent
  ],
  exports: [DynamicFormComponent],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormAddnameComponent,
    FormIdComponent,
    FormSelectSpecialityComponent
  ]
})
export class DynamicFormModule {}
