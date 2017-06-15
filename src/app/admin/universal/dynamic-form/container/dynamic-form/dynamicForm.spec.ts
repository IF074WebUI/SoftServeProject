
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {DynamicFormComponent} from "./dynamic-form.component";
import {CommonModule} from "@angular/common";
import {FormInputComponent} from "../../components/form-input/form-input.component";
import {FormSelectComponent} from "../../components/form-select/form-select.component";
import {DynamicFieldDirective} from "../../components/dynamic-field/dynamic-field.directive";
import {FormIdComponent} from "../../components/form-id/form-id.component";
import {FormTextareaComponent} from "../../components/form-textarea/form-textarea.component";
import {FormEmailComponent} from "../../components/form-email/form-email.component";
import {FormSelectWithOptionsComponent} from "../../components/form-select-with-options/form-select-with-options.component";
import {FormSelectTestDetailByIdComponent} from "../../components/form-select-test-detail-by-id/form-select-test-detail-by-id.component";
import {FormInputFileComponent} from "../../components/form-input-file/form-input-file.component";
import {FormNumberComponent} from "../../components/form-number/form-number.component";


describe('Dynamic-form module', () => {

  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(() => {

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [
        DynamicFormComponent]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(DynamicFormComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });
})
