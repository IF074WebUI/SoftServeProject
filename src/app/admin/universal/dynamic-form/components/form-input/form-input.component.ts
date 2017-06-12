import {AfterContentChecked, AfterContentInit, Component, OnChanges, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {GetRecordsBySearchService} from "../../../../services/get-records-by-search.service";

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

  constructor(private get_records_by_search: GetRecordsBySearchService){
  }

}

function MyValidateFunction(c: FormControl) {
  console.log('add works');
  return this.get_records_by_search.getRecordsBySearch(this.config.entity_name, c.value).map((resp) => {
      for (let key of resp) {
        let Properties = Object.getOwnPropertyNames(key);
        let unique_field = this.config.entity_name === 'Speciality' ? Properties[+[2]] : Properties[+[1]];
        if (key[unique_field] === c.value.trim()) {
          return {exists: true};
        }
      }
      return null;
    }
  );
}
