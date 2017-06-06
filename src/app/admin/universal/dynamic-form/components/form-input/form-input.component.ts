import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent {
  config;
  group: FormGroup;




  constructor(){
  }


}
