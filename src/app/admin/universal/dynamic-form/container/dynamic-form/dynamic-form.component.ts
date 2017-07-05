import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GetRecordsBySearchService} from '../../../../services/get-records-by-search.service';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

declare var $: any;

@Component({
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  templateUrl: './dynamic-form.component.html',
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

  stepOne: boolean;
  stepTwo: boolean;
  photo: string;
  validateEmail: Function;
  data: any;
  name: string;
  data1: any;
  cropperSettings1: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;
  session: any;


  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  constructor(private fb: FormBuilder, private get_records_by_search: GetRecordsBySearchService) {
    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 200;
    this.cropperSettings1.height = 200;

    this.cropperSettings1.croppedWidth = 200;
    this.cropperSettings1.croppedHeight = 200;

    this.cropperSettings1.canvasWidth = 400;
    this.cropperSettings1.canvasHeight = 200;

    this.cropperSettings1.minWidth = 10;
    this.cropperSettings1.minHeight = 10;

    this.cropperSettings1.rounded = false;
    this.cropperSettings1.keepAspect = false;

    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

    this.data1 = {};
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
    this.photo = this.data1.image;
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
      } else {
        group.addControl(control.name, this.fb.control(''));
      }
    });
    return group;
  }

  //  multistep modal

  submit() {
    if (this.entity_name === 'Question' || this.entity_name === 'Student' || this.entity_name === 'Answer') {
      this.stepTwo = true;
      this.stepOne = false;
      this.TITLE = this.INPUT_PHOTO;
      this.session = new Map;
      this.session.set('formValue', this.form.value);
    } else {
      this.submitted.emit(this.form.value);
    }
  }

  skip() {
    let formValue = Object.assign(this.session.get('formValue'), {'photo': this.photo});
    this.submitted.emit(formValue);
    this.data1 = {};
    this.session.delete('formValue');
  }

  savePhoto() {
    let formValue = Object.assign(this.session.get('formValue'), {'photo': this.photo});
    this.submitted.emit(formValue);
    this.stepOne = true;
    this.stepTwo = false;
    this.data1 = {};
   this.session.delete('formValue');
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
    this.stepOne = true;
    this.stepTwo = false;
    this.test_id = test_id;
    this.action = 'add_edit';
    this.entity = entity;
    this.entity_name = entity_name;
    this.photo = this.data1.image = photo || '';
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
    console.log(this.CONFIRM_QUESTION);
    $('#add_edit_deletePopup').modal('show');
  }

  // Method for closing modal

  cancel() {
    this.form.reset();
    this.CONFIRM_QUESTION = '';
    this.data1 = {};
    $('#add_edit_deletePopup').modal('hide');
  }
}

// Email and Async validators

export function validateEmail(email: FormControl) {
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  return EMAIL_REGEXP.test(email.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}

export function validateName(value: FormControl) {
  let name = value.value;
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

