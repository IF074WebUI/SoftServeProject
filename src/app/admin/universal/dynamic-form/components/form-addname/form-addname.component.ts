import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-form-addname',
  templateUrl: './form-addname.component.html',
  styleUrls: ['./form-addname.component.css']
})
export class FormAddnameComponent {
  config;
  group: FormGroup;
}
