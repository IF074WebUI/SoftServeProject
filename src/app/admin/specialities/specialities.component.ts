import { Component, OnInit } from '@angular/core';
import { SpecialitiesService } from '../services/specialities.service';
import { Speciality } from './speciality';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})
export class SpecialitiesComponent implements OnInit {

  SPECIALITIES_HEADERS: string[] = ['пор.номер', 'код спеціальності', 'назва спеціальності', 'дії'];
  NO_RECORDS: string = 'no records';
  SPECIALITIES_HEADER: string = 'Спеціальності';
  SPECIALITIES_ADD_TITLE: string = 'Додати спеціальність';
  FIRST_DROPDOWN_ITEM: number = 5;
  SECOND_DROPDOWN_ITEM: number = 10;
  THIRD_DROPDOWN_ITEM: number = 20;
  MODAL_TITLE: string = 'Додати (редагувати) спеціальність';
  MODAL_NAME: string = 'Назва спеціальності';
  MODAL_VALIDATION_NAME_REQUIRED: string = 'Вкажіть назву спеціальності';
  MODAL_VALIDATION_NAME_EXISTS: string = 'Така спеціальність вже існує';
  MODAL_VALIDATION_CODE_REQUIRED: string = 'Вкажіть код спеціальності';
  MODAL_CODE: string = 'Код спеціальності';
  BUTTON_SAVE: string = 'Зберегти';
  BUTTON_CANCEL: string = 'Відміна';
  BUTTON_CONFIRM: string = 'Підтвердити';
  MODAL_CONFIRM_HEADER: string = 'Ви справді бажаєте видалити спеціальність '

  specialities: Speciality[];   /* array of specialities that will be displayed on current page */
  delSpeciality: Speciality = new Speciality('', '');
  page = 1;                     /* current page */
  count: number;                /* count of all specialities */
  countPerPage = 5;             /* count of specialities per page */
  headers: string[];            /* array of headers */
  editId: number = 0;           /* id of edited speciality (if speciality is adding than 0 or undefined) */
  editName: string = '';
  specialitiesForm: FormGroup;
  specialitiesName: FormControl;
  specialitiesCode: FormControl;

  constructor(private specialitiesService: SpecialitiesService, private router: Router,
   private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.specialitiesName = new FormControl('', Validators.required, asyncValidator.bind(this));
    this.specialitiesCode = new FormControl('', Validators.required);
    this.specialitiesForm = new FormGroup({
      'name': this.specialitiesName,
      'code': this.specialitiesCode
    });
    this.headers = this.SPECIALITIES_HEADERS;
    this.getSpecialities();       /* get specialities for start page and count of specialities for pagination */
    this.getCount();
  }

  getSpecialities(): void {
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }

    this.specialitiesService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => this.specialities = resp, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.specialitiesService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  add() {
    this.editId = 0;
    this.specialitiesForm.reset();      /* reset form before add new speciality */
    $('#myModal').modal('show');
  }

  edit(speciality: Speciality) {
    this.specialitiesForm.reset();
    this.editId = speciality.speciality_id;
    this.editName = speciality.speciality_name;
    /* manually set inputs with speciality properties values being edited */
    this.specialitiesName.setValue(speciality.speciality_name);
    this.specialitiesCode.setValue(speciality.speciality_code);
    $('#myModal').modal('show');
  }

  save() {
    let speciality: Speciality = new Speciality(this.specialitiesName.value, this.specialitiesCode.value);
    if (this.editId) {                      /* check if we can edit or add subject */
      speciality['speciality_id'] = this.editId;
      this.specialitiesService.edit(speciality).subscribe(resp => {
        $('#myModal').modal('hide');
        this.getSpecialities();             /* after update speciality get all specialities from backend */
      },
        err => this.router.navigate(['/bad_request']));
    } else {
      this.specialitiesService.save(speciality).subscribe(resp => {
        $('#myModal').modal('hide');
        this.getSpecialities();             /* after add speciality get all specialities from backend */
        this.count++;                       /* also we reset new count of records to calculate pagination pages count */
      },
        err => this.router.navigate(['/bad_request']));
    }
  }

  cancel() {                                /* exit without add or edit speciality */
      $('#myModal').modal('hide');
      this.specialitiesForm.reset();
  }

  showDeleteConfirmDialog(speciality: Speciality) {
    $('#confirmModal').modal('show');
    this.delSpeciality = speciality;
  }

  cancelConfirm() {
    $('#confirmModal').modal('hide');
  }

  getGroupsBySpeciality(speciality: Speciality) {
    this.router.navigate(['./group'], {queryParams: {'specialityId': speciality.speciality_id}, relativeTo: this.activatedRoute.parent});
  }

  deleteSpeciality() {
      this.specialitiesService.delete(this.delSpeciality['speciality_id'])
        .subscribe(resp => {
            $('#confirmModal').modal('hide');
          --this.count;                   /* after delete speciality get all specialities from backend */
          this.getSpecialities();         /* also we reset new count of records to calculate pagination pages count */
        },
        err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number) {              /* callback method for change page pagination output event */
    this.page = page;
    this.getSpecialities();               /* request new specialilies for new page */
  }

  changeCountPerPage(itemsPerPage: number) {    /* callback method to set count entities per page when dropdown item had been selected */
    this.countPerPage = itemsPerPage;
    this.getSpecialities();
  }

  startSearch(criteria: string) {         /* callback method for output in search component */
    this.specialitiesService.searchByName(criteria).subscribe(resp => {
      if (resp['response'] === this.NO_RECORDS) {    /* check condition: if no records presented for search criteria */
        this.specialities = [];
        this.count = this.specialities.length;
      } else {
        this.page = 1;
        this.count = resp.length;                 /* if records are present than set specialities count to calculate pagination pages */
        this.specialities = resp.slice(0, this.countPerPage);  /* present only paginated specialities */
      }
    },
      err => this.router.navigate(['/bad_request']));
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
