import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {DynamicFormComponent} from './container/dynamic-form/dynamic-form.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormButtonComponent } from './components/form-button/form-button.component';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { FormIdComponent } from './components/form-id/form-id.component';
import { FormTextareaComponent } from './components/form-textarea/form-textarea.component';
import { FormEmailComponent } from './components/form-email/form-email.component';
import { FormSelectWithOptionsComponent } from './components/form-select-with-options/form-select-with-options.component';
import {FacultyService} from '../../faculties/faculty.service';
import { FormSelectTestDetailByIdComponent } from './components/form-select-test-detail-by-id/form-select-test-detail-by-id.component';

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
    FormIdComponent,
    FormTextareaComponent,
    FormEmailComponent,
    FormSelectWithOptionsComponent,
    FormSelectWithOptionsComponent,
    FormSelectTestDetailByIdComponent
  ],
  exports: [DynamicFormComponent],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormIdComponent,
    FormTextareaComponent,
    FormEmailComponent,
    FormSelectWithOptionsComponent,
    FormSelectTestDetailByIdComponent
  ],
  providers: [FacultyService]

})
export class DynamicFormModule {}
