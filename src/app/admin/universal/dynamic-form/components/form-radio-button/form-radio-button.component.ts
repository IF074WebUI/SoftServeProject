import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-radio-button',
  templateUrl: './form-radio-button.component.html',
  styleUrls: ['./form-radio-button.component.scss']
})
export class FormRadioButtonComponent implements OnInit {
  config;
  group: FormGroup;
  model: any = {};
  constructor() {
  }

  ngOnInit() {
    this.model = {'singlechoise': 1, 'multichoise': 2, 'input field': 3};
  }

  onValueChanged(event) {
    let value: any = event.target.value;
    this.group.controls[this.config.name].setValue(this.model[value]);
  }
}
