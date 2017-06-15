import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {GetRecordsBySearchService} from '../../../../services/get-records-by-search.service';

declare var $: any;

@Component({
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
  @Input()
  config: any[] = [];

  entity: any;
  test_id: number;
  entityForDelete: any;
  Properties: Array<string>;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  youCanDelete: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  action: string;
  entity_name: string;
  uniq_name: string;


  MODAL_ADD_TITLE = 'Створити';
  MODAL_EDIT_TITLE = 'Редагувати';
  MODAL_DELETE_TITLE = 'Видалення';
  TITLE: string;
  CONFIRM_QUESTION_TEXT = 'Ви підтверджуєте видалення';
  CONFIRM_QUESTION: string;
  CONFIRM_DELETE = 'Видалити';
  CLOSE = 'Закрити';
  SUBMIT_ADD_EDIT = 'Зберегти';

  constructor(private fb: FormBuilder, private get_records_by_search: GetRecordsBySearchService) {
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
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required, Validators.maxLength(control.requiredMax)])));
      }
      if (control.required) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required])));
      }
      if (control.requiredAsync) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required]), Validators.composeAsync([validateName.bind(this)])));
      // group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required])));
      } else {
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
    $('#add_edit_deletePopup').modal('hide');
  }


  sendItem(entity: any, entity_name?: string, test_id?: number) {
    this.test_id = test_id;
    this.action = 'add_edit';
    this.entity = entity;
    this.entity_name = entity_name;
    let InputEntityNames = Object.getOwnPropertyNames(entity);
    let FormNames = Object.getOwnPropertyNames(this.form.controls);
    for (let i = 0; i < InputEntityNames.length; i++) {
      this.form.controls[FormNames[+[i]]].setValue(this.entity[InputEntityNames[+[i]]]);
    }
    this.uniq_name = this.entity[InputEntityNames[0]];
    if (this.uniq_name) {
      this.TITLE = this.MODAL_EDIT_TITLE;
    } else {
      this.TITLE = this.MODAL_ADD_TITLE;
    }
  }

  deleteEntity(entity: any) {
    this.action = 'delete';
    this.entityForDelete = entity;
    this.Properties = Object.getOwnPropertyNames(this.entityForDelete);
    this.TITLE = this.MODAL_DELETE_TITLE;
    let Properties = Object.getOwnPropertyNames(entity);
      if (Properties[0] === 'speciality_id' || Properties[0] === 'test_id' || Properties[0] === 'id') {
        this.uniq_name = this.entityForDelete[Properties[2]];
      } else if (Properties[0] === 'user_id') {
        this.uniq_name = this.entityForDelete[Properties[2]] + ' ' + this.entityForDelete[Properties[3]] + ' ' + this.entityForDelete[Properties[4]];
      } else {
        this.uniq_name = this.entityForDelete[Properties[1]];
      }
    this.CONFIRM_QUESTION = this.CONFIRM_QUESTION_TEXT + ' ' + this.uniq_name;
    $('#add_edit_deletePopup').modal('show');
  }

  // Method for closing modal

  cancel() {
    this.form.reset();
    this.CONFIRM_QUESTION = '';
    $('#add_edit_deletePopup').modal('hide');
  }
}

// Email and Async validators

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

function validateName(c: FormControl) {
  let name = c.value;
  if (this.entity_name) {
    return this.get_records_by_search.getRecordsBySearch(this.entity_name, name).map((resp) => {
        for (let key of resp) {
          let Properties = Object.getOwnPropertyNames(key);
          let unique_field = this.entity_name === 'Speciality' ? Properties[+[2]] : Properties[+[1]];
          if (key[unique_field] === name.trim()) {
            return {exists: true};
          }
        }
        return null;
      }
    );
  } else {
    return Promise.resolve().then(() => {
      return null;
    });
  }
}

