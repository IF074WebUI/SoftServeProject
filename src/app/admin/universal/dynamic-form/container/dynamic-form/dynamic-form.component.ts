import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {FacultyService} from '../../../../faculties/faculty.service';
import {GetRecordsBySearchService} from '../../../../services/get-records-by-search.service';


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
        if (key['faculty_name'] === c.value.trim()) {
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
  test_id: string;
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
  CONFIRM_ANSWER = 'Ви підтверджуєте видалення ';
  CONFIRM_DELETE = 'Видалити';
  CLOSE = 'Закрити';

  constructor(private fb: FormBuilder, private get_records_by_search: GetRecordsBySearchService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  createGroup() {
    const group = this.fb.group({});
    this.config.forEach(control => {
      if (control.type === 'email') {
        group.addControl(control.name, this.fb.control('', Validators.compose([validateEmail])));
      }
      if (control.required) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required])));
      }
      if (control.requiresAsync) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required]), Validators.composeAsync([validateName.bind(this)])));
      }
      if (control.requiredMax) {
        group.addControl(control.name, this.fb.control('', Validators.compose([Validators.maxLength(10)])));
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


  sendItem(entity: any, entity_name?: string, test_id?: string) {
    this.test_id = test_id;
    this.action = 'add_edit';
    this.entity = entity;
    this.entity_name = entity_name;
    let InputEntityNames = Object.getOwnPropertyNames(entity);
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
    this.CONFIRM_ANSWER = this.CONFIRM_ANSWER + '' + this.entityForDelete[this.Properties[1]] + '?';
    $('#add_edit_deletePopup').modal('show');
  }

  // Method for closing modal

  cancel() {
    $('#add_edit_deletePopup').modal('hide');
    this.form.reset();
  }

}



