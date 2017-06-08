import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GetAllRecordsService} from '../../../../services/get-all-records.service';

@Component({
  selector: 'app-form-select-speciality',
  templateUrl: './form-select-speciality.component.html',
  styleUrls: ['./form-select-speciality.component.css']
})
export class FormSelectSpecialityComponent<T> implements OnInit {
  config;
  group: FormGroup;
  entities: Array<T>;
  Properties: Array<string>;

  constructor(private entityService: GetAllRecordsService) { }

  ngOnInit() {
    this.entityService.getAllRecords(this.config.name).subscribe(resp => {
      this.entities = resp;
      this.Properties = Object.getOwnPropertyNames(this.entities[0]);
      console.log(this.Properties);
      if (this.config.name === 'Speciality') {}
    });

  }

}
