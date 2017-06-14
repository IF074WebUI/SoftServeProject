import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-form-number',
  templateUrl: './form-number.component.html',
  styleUrls: ['./form-number.component.css']
})
export class FormNumberComponent implements OnInit {
  config;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
