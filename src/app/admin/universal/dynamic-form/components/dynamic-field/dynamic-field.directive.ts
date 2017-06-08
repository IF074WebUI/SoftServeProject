import { ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormButtonComponent } from '../form-button/form-button.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import {FormIdComponent} from '../form-id/form-id.component';
import {FormSelectSpecialityComponent} from '../form-select-speciality/form-select-speciality.component';
import {FormTextareaComponent} from '../form-textarea/form-textarea.component';
import {FormEmailComponent} from '../form-email/form-email.component';
import {FormSelectWithOptionsComponent} from '../form-select-with-options/form-select-with-options.component';

const components = {
  button: FormButtonComponent,
  input: FormInputComponent,
  select: FormSelectComponent,
  select_speciality: FormSelectSpecialityComponent,
  id: FormIdComponent,
  textarea: FormTextareaComponent,
  email: FormEmailComponent,
  select_with_options: FormSelectWithOptionsComponent
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
