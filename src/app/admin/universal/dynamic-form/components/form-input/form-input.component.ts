import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FacultyService} from "../../../../faculties/faculty.service";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent {
  config;
  group: FormGroup;
  MODAL_VALIDATION_NAME_REQUIRED = 'Введіть назву';
  MODAL_VALIDATION_NAME_EXISTS = 'Введена назва вже існує';
  MODAL_VALIDATION_NAME_TOLONG = 'Перевищена кільксть символів';
  constructor(private facultyService: FacultyService){
  }

}
