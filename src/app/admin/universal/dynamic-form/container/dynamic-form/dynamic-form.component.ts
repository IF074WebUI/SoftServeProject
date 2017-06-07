import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {FacultyService} from '../../../../faculties/faculty.service';

declare var $: any;
@Component({
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  templateUrl: './dynamic-form.component.html',
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
      (control.required === true) ? group.addControl(control.name, this.fb.control('', [Validators.required])) : group.addControl(control.name, this.fb.control(''));
    });
    return group;
  }

// Methods for parents

  showModal() {
    $('#add_edit_deletePopup').modal('show');
  }

  submitDelete(entity) {
    console.log(this.entity);
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

  //
  // ValidatorUniqName(name: FormControl) {
  //   console.log('name');
  //   return this.facultyService.searchByName(name['faculty_name'].value).map((resp: Faculty[]) => {
  //       console.log('next step');
  //       for (let key of resp) {
  //         if (key['faculty_name'] === name['faculty_name'].value.trim()) {
  //           console.log('exist');
  //           return {exists: true};
  //         }
  //       }
  //       console.log('not exist');
  //
  //       return null;
  //     }
  //   );
  // }


}
