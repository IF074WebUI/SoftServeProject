import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Speciality } from '../specialities/speciality';
import { SpecialitiesService } from '../services/specialities.service';

declare var $: any;

@Component({
  selector: 'dtester-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

export class PopupComponent implements OnInit {

  MODAL_ADD_TITLE: string = 'Додати спеціальність';
  MODAL_EDIT_TITLE: string = 'Редагувати спеціальність';
  MODAL_NAME: string = 'Назва спеціальності';
  MODAL_CODE: string = 'Код спеціальності';
  MODAL_VALIDATION_NAME_REQUIRED: string = 'Вкажіть назву спеціальності';
  MODAL_VALIDATION_NAME_EXISTS: string = 'Така спеціальність вже існує';
  MODAL_VALIDATION_CODE_REQUIRED: string = 'Вкажіть код спеціальності';
  BUTTON_SAVE: string = 'Зберегти';
  BUTTON_CANCEL: string = 'Відміна';
  BUTTON_CONFIRM: string = 'Підтвердити';
  MODAL_CONFIRM_BODY: string = 'Ви справді бажаєте видалити спеціальність ';
  MODAL_CONFIRM_HEADER: string = 'Увага';


  speciality: Speciality;
  @Output() editSpeciality: EventEmitter<Speciality> = new EventEmitter();
  @Output() saveSpeciality: EventEmitter<Speciality> = new EventEmitter();
  @Output() deleteSpeciality: EventEmitter<Speciality> = new EventEmitter();
  action: string;
  specialitiesForm: FormGroup;
  specialitiesName: FormControl;
  specialitiesCode: FormControl;

  constructor(private specialitiesService: SpecialitiesService) { }

  ngOnInit() {
    this.specialitiesName = new FormControl('', Validators.required, asyncValidator.bind(this));
    this.specialitiesCode = new FormControl('', Validators.required);
    this.specialitiesForm = new FormGroup({
      'name': this.specialitiesName,
      'code': this.specialitiesCode
    });
  }

  showModal(val: string, speciality: Speciality) {
    this.action = val;
    this.speciality = speciality;
    if (val !== 'confirm') {
      this.specialitiesName.setValue(speciality.speciality_name);
      this.specialitiesCode.setValue(speciality.speciality_code);
    }
      $('#myModal').modal('show');
  }

  hideModal() {
    $('#myModal').modal('hide');
  }

  saveOrEdit() {
    let saveOrEditSpeciality: Speciality = new Speciality(this.specialitiesName.value, this.specialitiesCode.value);
    if (this.action === 'add') {
      this.saveSpeciality.emit(saveOrEditSpeciality);
    } else if (this.action === 'edit') {
      saveOrEditSpeciality['speciality_id'] = this.speciality.speciality_id;
      this.editSpeciality.emit(saveOrEditSpeciality);
    }
    this.specialitiesForm.reset();
  }

  delSpeciality() {
    this.deleteSpeciality.emit(this.speciality);
  }

  cancel() {                                /* exit without add or edit speciality */
    this.hideModal();
    this.specialitiesForm.reset();
  }
}

/* asynchronous validator function to validate adding or updating existing specialities */
function asyncValidator(control: AbstractControl) {
  return this.specialitiesService.searchByName(control.value).map((res: Speciality[]) => {
    for (const speciality of res) {
      if (speciality.speciality_name === control.value.trim() && control.dirty) {
        if (this.editId && this.editName === control.value.trim()) {
          return null;
        }
        return {exists: true};
      }
    }
    return null;
  });
}
