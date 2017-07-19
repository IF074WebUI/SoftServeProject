import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-email',
  templateUrl: './form-email.component.html',
  styleUrls: ['./form-email.component.scss']
})
export class FormEmailComponent {
  config;
  group: FormGroup;

  ERROR_MSG = 'Email повинен відповідати формату john@doe.com';

  constructor() { }

}
