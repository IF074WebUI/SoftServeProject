import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-hidden',
  templateUrl: './form-hidden.component.html',
  styleUrls: ['./form-hidden.component.scss']
})
export class FormHiddenComponent implements OnInit {
  config;
  group: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
