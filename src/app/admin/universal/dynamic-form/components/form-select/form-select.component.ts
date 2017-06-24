import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GetAllRecordsService} from '../../../../services/get-all-records.service';
import {TestDetailService} from "../../../../test-detail/test-detail.service";
@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss']
})
export class FormSelectComponent<T> implements OnInit {
  config;
  group: FormGroup;
  entities: Array<T>;
  Properties: Array<string>;
  item_name: string;

  constructor(private entityService: GetAllRecordsService, private testService: TestDetailService) {
  }


  ngOnInit() {
    this.entityService.getAllRecords(this.config.name).subscribe(resp => {
      this.entities = resp;
      this.Properties = Object.getOwnPropertyNames(this.entities[0]);
      if (this.config.name === 'Speciality'){this.item_name = this.Properties[+[2]]} else {this.item_name = this.Properties[+[1]]}
    });


  }
}





