import { ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import {FormIdComponent} from '../form-id/form-id.component';
import {FormTextareaComponent} from '../form-textarea/form-textarea.component';
import {FormEmailComponent} from '../form-email/form-email.component';
import {FormSelectWithOptionsComponent} from '../form-select-with-options/form-select-with-options.component';
import {FormSelectTestDetailByIdComponent} from '../form-select-test-detail-by-id/form-select-test-detail-by-id.component';
import {FormNumberComponent} from '../form-number/form-number.component';
import {FormRadioButtonComponent} from '../form-radio-button/form-radio-button.component';

const components = {
  input: FormInputComponent,
  select: FormSelectComponent,
  id: FormIdComponent,
  textarea: FormTextareaComponent,
  email: FormEmailComponent,
  select_with_options: FormSelectWithOptionsComponent,
  sect_test_detail_by_id: FormSelectTestDetailByIdComponent,
  number: FormNumberComponent,
  radio: FormRadioButtonComponent,
};



@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  component;

  @Input()
  config;
  @Input()
  group: FormGroup;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}



  ngOnInit() {
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}
