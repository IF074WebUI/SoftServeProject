import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {GetRecordsBySearchService} from '../../../../services/get-records-by-search.service';
import {SessionService} from './session.service';


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
  INPUT_PHOTO = 'Завантажити фотографію';
  SKIP = 'Пропустити';

  step1: boolean;
  step2: boolean;
  photo: string;
  validateEmail: Function;

  constructor(private fb: FormBuilder, private get_records_by_search: GetRecordsBySearchService, private _SessionService: SessionService) {
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
        //   group.addControl(control.name, this.fb.control('', Validators.compose([Validators.required])));
      } else {
        group.addControl(control.name, this.fb.control(''));
      }
    });
    return group;
  }

  //  multistep modal

  submit() {
    if (this.entity_name === 'Question' || this.entity_name === 'Student' || this.entity_name === 'answer') {
      this.step2 = true;
      this.step1 = false;
      this.TITLE = this.INPUT_PHOTO;
      this._SessionService.set('formValue', this.form.value);
    } else {
      this.submitted.emit(this.form.value);
    }
  }

  imageChange($event): void {
    this.readThis($event.target);
//    const preview = document.querySelector('img');
  }


  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let string = myReader.result;
      this.photo = string;
    };
    myReader.readAsDataURL(file);
  }

  skip() {
    let formValue = Object.assign(this._SessionService.get('formValue'), {'photo': this.photo});
    this.submitted.emit(formValue);
    // let preview = document.querySelector('#preview');
    // preview.innerHTML = '';
    this._SessionService.remove('formValue');
  }

  savePhoto() {
    let formValue = Object.assign(this._SessionService.get('formValue'), {'photo': this.photo});
    this.submitted.emit(formValue);
    this.step1 = true;
    this.step2 = false;
    // let preview = document.querySelector('#preview');
    // preview.innerHTML = '';
    this._SessionService.remove('formValue');
  }


// Methods for parents

  showModal() {
    $('#add_edit_deletePopup').modal('show');
  }

  submitDelete(entity) {
    this.youCanDelete.emit(this.entityForDelete);
    $('#add_edit_deletePopup').modal('hide');
  }


  sendItem(entity: any, entity_name?: string, test_id?: number, photo?: string) {
    this.step1 = true;
    this.step2 = false;
    this.test_id = test_id;
    this.action = 'add_edit';
    this.entity = entity;
    this.entity_name = entity_name;
    this.photo = photo || '';
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
    if (Properties[0] === 'speciality_id' || Properties[0] === 'test_id' || Properties[0] === 'id' || Properties[0] === 'question_id') {
      this.uniq_name = this.entityForDelete[Properties[2]];
    } else if (Properties[0] === 'user_id') {
      this.uniq_name = this.entityForDelete[Properties[2]] + ' ' + this.entityForDelete[Properties[3]] + ' ' + this.entityForDelete[Properties[4]];
    }
    else if (Properties[0] === 'answer_id') {
      this.uniq_name = this.entityForDelete[Properties[3]];
    }
    else {
      this.uniq_name = this.entityForDelete[Properties[1]];
    }
    this.CONFIRM_QUESTION = this.CONFIRM_QUESTION_TEXT + ' ' + this.uniq_name;
    $('#add_edit_deletePopup').modal('show');
  }

  // Method for closing modal

  cancel() {
    this.form.reset();
    this.CONFIRM_QUESTION = '';
    this._SessionService.remove('formValue');
    $('#add_edit_deletePopup').modal('hide');
  }
}

// Email and Async validators

interface Validator<T extends FormControl> {
  (c: T): { [error: string]: any };
}

export function validateEmail(c: FormControl) {
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}

export function validateName(c: FormControl) {
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

