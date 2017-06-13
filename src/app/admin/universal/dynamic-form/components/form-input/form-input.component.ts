import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {GetRecordsBySearchService} from '../../../../services/get-records-by-search.service';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent implements OnInit {
  config;
  group: FormGroup;
  MODAL_VALIDATION_NAME_REQUIRED = 'Введіть назву';
  MODAL_VALIDATION_NAME_EXISTS = 'Введена назва вже існує';
  MODAL_VALIDATION_NAME_TOLONG = 'Перевищена кільксть символів';

  constructor(private get_records_by_search: GetRecordsBySearchService) {
  }

  ngOnInit() {
    // if (this.config.requiresAsync) {
    //   if (this.config.action === 'add') {
    //     console.log('add workds');
    //     return this.get_records_by_search.getRecordsBySearch(this.config.entity_name, this.group.controls[this.config.name].value).map((resp) => {
    //         for (let key of resp) {
    //           let Properties = Object.getOwnPropertyNames(key);
    //           let unique_field = this.config.entity_name === 'Speciality' ? Properties[+[2]] : Properties[+[1]];
    //           if (key[unique_field] === this.group.controls[this.config.name].value.trim()) {
    //             console.log('exists - true')
    //             return {exists: true};
    //           }
    //         }
    //         return null;
    //       }
    //     );
    //   }
    //   if (this.config.action === 'edit') {
    //     console.log('edit works');
    //     return Promise.resolve().then(() => {
    //       return null;
    //     });
    //   }
    }

  }

//
// function validateName(c: FormControl) {
//   if (this.group.control.action === 'add') {
//     console.log('add workds');
//     return this.get_records_by_search.getRecordsBySearch(this.entity_name, c.value).map((resp) => {
//         for (let key of resp) {
//           let Properties = Object.getOwnPropertyNames(key);
//           let unique_field = this.entity_name === 'Speciality' ? Properties[+[2]] : Properties[+[1]];
//           if (key[unique_field] === c.value.trim()) {
//             return {exists: true};
//           }
//         }
//         return null;
//       }
//     );
//   }
//   if (this.control.action === 'edit') {
//     console.log('edit works');
//     return Promise.resolve().then(() => {
//       return null;
//     });
//   }
// }

