import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-select-with-options',
  templateUrl: './form-select-with-options.component.html',
  styleUrls: ['./form-select-with-options.component.scss']
})
export class FormSelectWithOptionsComponent {
  config;
  group: FormGroup;
  test_id;

  constructor() {
  }

}
