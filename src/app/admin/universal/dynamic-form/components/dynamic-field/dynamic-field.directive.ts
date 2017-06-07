import { ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormButtonComponent } from '../form-button/form-button.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import { FormAddnameComponent } from '../form-uniqname/form-uniqname.component';
import {FormIdComponent} from '../form-id/form-id.component';
import {FormSelectSpecialityComponent} from "../form-select-speciality/form-select-speciality.component";

const components = {
  button: FormButtonComponent,
  input: FormInputComponent,
  select: FormSelectComponent,
  select_speciality: FormSelectSpecialityComponent,
  addname: FormAddnameComponent,
  id: FormIdComponent
};



@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  @Input()
  config;

  @Input()
  group: FormGroup;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  component;

  ngOnInit() {
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}
