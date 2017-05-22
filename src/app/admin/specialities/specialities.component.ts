import {Component, OnInit} from '@angular/core';
import {SpecialitiesService} from "../services/specialities.service";
import {Speciality} from "./speciality";
import {SPECIALITIES_HEADERS} from "../../constants";
import {FormControl, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {Router} from "@angular/router";


declare var $: any;

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})
export class SpecialitiesComponent implements OnInit {

  specialities: Speciality[];
  page: number = 1;
  count: number;
  countPerPage: number = 5;
  headers: string[];
  editId: number = 0;
  specialitiesForm: FormGroup;
  specialitiesName: FormControl;
  specialitiesCode: FormControl;

  constructor(private specialitiesService: SpecialitiesService, private router: Router) {
  }

  ngOnInit() {
    this.specialitiesName = new FormControl('', Validators.required, asyncValidator.bind(this));
    this.specialitiesCode = new FormControl('', Validators.required);
    this.specialitiesForm = new FormGroup({
      'name': this.specialitiesName,
      'code': this.specialitiesCode
    })
    this.headers = SPECIALITIES_HEADERS;
    this.getSpecialities();
    this.getCount();
  }

  getSpecialities(): void {
    if (this.count < (this.page - 1) * this.countPerPage) {
      --this.page;
    }

    this.specialitiesService.paginate(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => this.specialities = resp, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.specialitiesService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  add() {
    this.editId = 0;
    this.specialitiesForm.reset();
    $('#myModal').modal('show');
  }

  edit(speciality: Speciality) {
    this.editId = speciality.speciality_id;
    this.specialitiesName.setValue(speciality.speciality_name);
    this.specialitiesCode.setValue(speciality.speciality_code);
    $('#myModal').modal('show');
  }

  save() {
    let speciality: Speciality = new Speciality(this.specialitiesName.value, this.specialitiesCode.value);
    if (this.editId) {
      speciality['speciality_id'] = this.editId;
      this.specialitiesService.edit(speciality).subscribe(resp => {
        $('#myModal').modal('hide');
        this.getSpecialities();
      },
        err => this.router.navigate(['/bad_request']));
    } else {
      this.specialitiesService.save(speciality).subscribe(resp => {
        $('#myModal').modal('hide');
        this.getSpecialities();
      },
        err => this.router.navigate(['/bad_request']));
    }
  }

  cancel() {
    if (confirm('Зіни будуть втрачені, продовжити?')) {
      $('#myModal').modal('hide');
      this.specialitiesForm.reset();
    }
  }

  delete(speciality: Speciality) {
    if (confirm('Ви справді бажаєте видалити цю спеціальність?'))
      this.specialitiesService.delete(speciality['speciality_id']).subscribe(resp => {
        console.log(resp);
        this.getCount();
      },
        err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number) {
    this.page = page;
    this.getSpecialities();
  }

  changePerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getSpecialities();
  }

  startSearch(criteria: string) {
    this.specialitiesService.searchByName(criteria).subscribe(resp => {
      console.log(resp);
      if (resp['response'] === 'no records') {
        this.specialities = [];
        this.count = this.specialities.length;
      } else {
        this.count = resp.length;
        this.specialities = resp.slice(0, this.countPerPage);
        console.log(this.count);
      }


    },
      err => this.router.navigate(['/bad_request']));
  }
}

function asyncValidator(control: AbstractControl) {
  return this.specialitiesService.searchByName(control.value).map((res: Speciality[]) => {
    for (let speciality of res) {
      if (speciality.speciality_name === control.value.trim()) {
        return {exists: true};
      }
    }
    return null;
  });
}
