import { Component } from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.css']
})
export class FormTextareaComponent {
  config;
  group: FormGroup;

  constructor() { }
}
