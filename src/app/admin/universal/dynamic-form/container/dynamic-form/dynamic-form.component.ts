import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import {FacultyService} from '../../../../faculties/faculty.service';
import {Faculty} from "../../../../faculties/Faculty";


interface Validator<T extends FormControl> {
  (c: T): {[error: string]: any};
}

function validateEmail(c: FormControl) {
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}

//
// function validateName(c: AbstractControl) {
//   console.log(c);
//   let array = [];
//  // this.facultyService.searchByName(c.value).map(resp =>  array = resp);
//  console.log(array);
//   // return array.test(c.value) ? null :  {valid: false};
//   //
//   // this.facultyService.searchByName(c.value).map((resp: Faculty[]) => {
//   //     console.log('next step');
//   //     for (let key of resp) {
//   //       if (key['faculty_name'] === c.value.trim()) {
//   //         console.log('exist');
//   //       }
//   //     }
//   //     console.log('not exist');
//   // }  ? null :
//   // );
// }


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
  @Input()
  entity: any;
  entityForDelete: any;
  Properties: Array<string>;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  youCanDelete: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  action: string;

  MODAL_ADD_TITLE = 'Редагування';
  MODAL_DELETE_TITLE = 'Видалення';
  TITLE: string;
  CONFIRM_ANSWER = 'Ви підтверджуєте видалення ';
  CONFIRM_DELETE = 'Видалити';
  CLOSE = 'Закрити';

  constructor(private fb: FormBuilder, private facultyService: FacultyService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  createGroup() {
    const group = this.fb.group({});
    this.config.forEach(control => {
     if (control.type === 'email') { group.addControl(control.name, this.fb.control('',  Validators.compose([validateEmail])))};
      (control.required === true) ? group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required]))) : group.addControl(control.name, this.fb.control(''));
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

  sendItem(entity: any) {
    this.action = 'add_edit';
    this.entity = entity;
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

//   function validateName(c: AbstractControl) {
//   console.log(c);
//   let array = [];
//   let UNIQ_NAME = this.facultyService.searchByName(c.value).subscribe(resp =>  array = resp)
//   return this.facultyService.searchByName(c.value).map((resp: Faculty[]) => {
//     console.log('next step');
//     for (let key of resp) {
//       if (key['faculty_name'] === c.value.trim()) {
//         console.log('exist');
//       }
//     }
//     console.log('not exist');
//   }  ? null : {valid: false};
// );
}



