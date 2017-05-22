import {Component, OnInit} from '@angular/core';
import {SpecialitiesService} from "../services/specialities.service";
import {Speciality} from "./speciality";
import {SPECIALITIES_HEADERS} from "../../constants";
import {FormControl, FormGroup, Validators, AbstractControl} from "@angular/forms";


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
  speciality: Speciality = new Speciality('', '');
  canEdit: boolean = false;
  specialitiesForm: FormGroup;
  specialitiesName: FormControl;
  specialitiesCode: FormControl;

  constructor(private specialitiesService: SpecialitiesService) {
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

    this.specialitiesService.paginate(this.countPerPage, (this.page - 1) * this.countPerPage).subscribe(resp => this.specialities = resp);
  }

  getCount(): void {
    this.specialitiesService.getCount().subscribe(resp => this.count = resp);
  }

  add() {
    this.speciality = new Speciality('', '');
    $('#myModal').modal('show');
  }

  edit(speciality: Speciality) {
    this.canEdit = true;
    this.speciality = speciality;
    $('#myModal').modal('show');
  }

  save() {
    if (this.canEdit) {
      this.specialitiesService.edit(this.speciality).subscribe(resp => {
        $('#myModal').modal('hide');
        this.canEdit = false;
      });
    } else {
      this.specialitiesService.save(this.speciality).subscribe(resp => {
        this.getSpecialities();
        $('#myModal').modal('hide');
      });
    }
  }

  cancel() {
    if (confirm('Зіни будуть втрачені, продовжити?')) {
      $('#myModal').modal('hide');
    }
  }

  delete(speciality: Speciality) {
    if (confirm('Ви справді бажаєте видалити цю спеціальність?'))
      this.specialitiesService.delete(speciality['speciality_id']).subscribe(resp => {
        console.log(resp);
        this.getCount()
      });
  }

  changePage(page: number) {
    this.page = page;
    this.getSpecialities()
  }

  changePerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getSpecialities();
  }

  startSearch(criteria: string) {
    console.log(criteria);
    this.specialitiesService.searchByName(criteria).subscribe(resp => {
      this.specialities = resp;
      this.count = resp.length;
    });
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
  })
}
