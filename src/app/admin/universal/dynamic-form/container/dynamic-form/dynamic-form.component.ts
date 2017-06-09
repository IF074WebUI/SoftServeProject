import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {FacultyService} from '../../../../faculties/faculty.service';
import {GetRecordsBySearchService} from '../../../../services/get-records-by-search.service';
import {TestDetailService} from "../../../../test-detail/test-detail.service";


interface Validator<T extends FormControl> {
  (c: T): { [error: string]: any };
}

function validateEmail(c: FormControl) {
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}


function validateName(c: AbstractControl) {
  return this.get_records_by_search.getRecordsBySearch(this.entity_name, c.value).map((resp) => {
    for (let key of resp) {
      let Properties = Object.getOwnPropertyNames(key);
      let unique_field =  this.entity_name === 'Speciality' ? Properties[+[2]] : Properties[+[1]];
      if (key[unique_field] === c.value.trim()) {
          return {exists: true};
        }
      }
      return null;
    }
  );
}

function validateTestDetail(c: AbstractControl){
  // console.log('test id' + this.test_id);
  // console.log(c.value);
  return this.testDetailService.getTestDetails(this.test_id).map((resp) => {
    console.log('response' + resp);
      for (let key of resp) {
        console.log(key['level']);
        if (key['level'] === c.value) {
          return {exists: true};
        }
      }
      return null;
    }
  );
}


declare var $: any;

@Component({
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  templateUrl: './dynamic-form.component.html',
  providers: [FacultyService]
})
export class DynamicFormComponent implements OnInit {
  @Input()
  config: any[] = [];
  // @Input()
   entity: any;
 // @Input()
 public test_id: number;
  entityForDelete: any;
  Properties: Array<string>;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  youCanDelete: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  action: string;
  entity_name: string;


  MODAL_ADD_TITLE = 'Редагування';
  MODAL_DELETE_TITLE = 'Видалення';
  TITLE: string;
  CONFIRM_ANSWER_TEXT = 'Ви підтверджуєте видалення ';
  CONFIRM_ANSWER: string;
  CONFIRM_DELETE = 'Видалити';
  CLOSE = 'Закрити';

  constructor(private fb: FormBuilder, private get_records_by_search: GetRecordsBySearchService, private route: ActivatedRoute, private router: Router, private testDetailService: TestDetailService) {
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  createGroup() {
    const group = this.fb.group({});
    this.config.forEach(control => {
      if (control.emailPattern) {
        group.addControl(control.name, this.fb.control('', Validators.compose([validateEmail])));
      }
      if (control.requiredMax) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.maxLength(control.requiredMax)])));
      }
      if (control.required) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required])));
      }
      if (control.requiresAsync) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required]), Validators.composeAsync([validateName.bind(this)])));
      }
      if (control.validateTestDetail) {
        group.addControl(control.name, this.fb.control('', Validators.composeAsync([validateTestDetail.bind(this)])));
      }
      else {
        group.addControl(control.name, this.fb.control(''));
      }
    });
    return group;
  }

// Methods for parents

  showModal() {
    $('#add_edit_deletePopup').modal('show');
  }

  submitDelete(entity) {
    this.youCanDelete.emit(this.entityForDelete);
  }


  sendItem(entity: any, entity_name?: string, test_id?: number) {
    this.test_id = test_id;
    this.action = 'add_edit';
    this.entity = entity;
    this.entity_name = entity_name;
    let InputEntityNames = Object.getOwnPropertyNames(entity);
    console.log(this.test_id);
    let FormNames = Object.getOwnPropertyNames(this.form.controls);
    for (let i = 0; i < InputEntityNames.length; i++) {
      this.form.controls[FormNames[+[i]]].setValue(this.entity[InputEntityNames[+[i]]]);
    }
    this.TITLE = this.MODAL_ADD_TITLE;


  }

  deleteEntity(entity: any) {
    this.action = 'delete';
    this.entityForDelete = entity;
    this.Properties = Object.getOwnPropertyNames(this.entityForDelete);
    this.TITLE = this.MODAL_DELETE_TITLE;
    this.CONFIRM_ANSWER = this.CONFIRM_ANSWER_TEXT + '' + this.entityForDelete[this.Properties[1]] + '?';
    $('#add_edit_deletePopup').modal('show');
  }

  // Method for closing modal

  cancel() {
    this.form.reset();
    this.CONFIRM_ANSWER = '';
    $('#add_edit_deletePopup').modal('hide');
  }

}



