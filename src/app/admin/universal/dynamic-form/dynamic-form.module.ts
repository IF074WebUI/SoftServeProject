import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {DynamicFormComponent} from './container/dynamic-form/dynamic-form.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { FormIdComponent } from './components/form-id/form-id.component';
import { FormTextareaComponent } from './components/form-textarea/form-textarea.component';
import { FormEmailComponent } from './components/form-email/form-email.component';
import { FormSelectWithOptionsComponent } from './components/form-select-with-options/form-select-with-options.component';
import {FacultyService} from '../../services/faculty.service';
import { FormSelectTestDetailByIdComponent } from './components/form-select-test-detail-by-id/form-select-test-detail-by-id.component';
import { FormInputFileComponent } from './components/form-input-file/form-input-file.component';
import { FormNumberComponent } from './components/form-number/form-number.component';
import { FormRadioButtonComponent } from './components/form-radio-button/form-radio-button.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    DynamicFormComponent,
    FormInputComponent,
    FormSelectComponent,
    DynamicFieldDirective,
    FormIdComponent,
    FormTextareaComponent,
    FormEmailComponent,
    FormSelectWithOptionsComponent,
    FormSelectTestDetailByIdComponent,
    FormInputFileComponent,
    FormNumberComponent,
    FormRadioButtonComponent
  ],
  exports: [DynamicFormComponent],
  entryComponents: [
    FormInputComponent,
    FormSelectComponent,
    FormIdComponent,
    FormTextareaComponent,
    FormEmailComponent,
    FormSelectWithOptionsComponent,
    FormSelectTestDetailByIdComponent,
    FormInputFileComponent,
    FormNumberComponent,
    FormRadioButtonComponent
  ],
  providers: []

})
export class DynamicFormModule {}
