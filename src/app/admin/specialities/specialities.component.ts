import {Component, OnInit, ViewChild} from '@angular/core';
import { SpecialitiesService } from '../services/specialities.service';
import { Speciality } from './speciality';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { SpinnerService } from '../universal/spinner/spinner.service';
import { SPECIALITY_CONFIG } from '../universal/dynamic-form/config';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { NO_RECORDS } from '../../constants';

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})

export class SpecialitiesComponent implements OnInit {

  readonly SPECIALITIES_HEADERS: string[] = ['№', 'назва спеціальності', 'код спеціальності'];
  readonly IGNORE_PROPERTIES: string[] = ['speciality_id'];
  readonly DISPLAY_PROPERTIES_ORDER: string[] = ['speciality_name', 'speciality_code'];
  readonly SORT_PROPERTIES: string[] = ['speciality_name'];

  specialities: Speciality[];
  page = 1;
  count: number;
  countPerPage = 5;
  headers: string[];
  sortProperties: string[];
  ignoreProperties: string[];
  displayPropertiesOrder: string[];
  editName = '';

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = SPECIALITY_CONFIG;

  constructor(private specialitiesService: SpecialitiesService, private router: Router,
   private activatedRoute: ActivatedRoute, private toastr: ToastsManager, private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.headers = this.SPECIALITIES_HEADERS;
    this.ignoreProperties = this.IGNORE_PROPERTIES;
    this.sortProperties = this.SORT_PROPERTIES;
    this.displayPropertiesOrder = this.DISPLAY_PROPERTIES_ORDER;
    this.getSpecialities();
    this.getCount();
  }

  getSpecialities(): void {
    this.spinnerService.showSpinner();
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.specialitiesService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => {this.specialities = resp;
      this.spinnerService.hideSpinner(); }, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.specialitiesService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  add():void {
    this.popup.sendItem(new Speciality('', ''), 'Speciality');
    this.popup.showModal();
  }

  edit(speciality: Speciality):void {
    this.popup.sendItem(speciality);
    this.popup.showModal();
  }

  delete(speciality: Speciality):void {
    this.popup.deleteEntity(speciality);
  }

  formSubmitted(speciality: Speciality): void {
    if (speciality['speciality_id']) {
      console.log(speciality);
      this.specialitiesService.edit(speciality).subscribe(resp => {
          this.popup.cancel();
          this.getSpecialities();
          this.toastr.success(`Спеціальність ${speciality.speciality_name} успішно відредагована`);
        },
        err => this.router.navigate(['/bad_request']));
    } else {
      delete speciality.speciality_id;
      this.specialitiesService.save(speciality).subscribe(resp => {
          this.popup.cancel();
          this.getSpecialities();
          this.count++;
          this.toastr.success(`Спеціальність ${speciality.speciality_name} успішно збережена`);
        },
        err => this.router.navigate(['/bad_request']));
    }
  }

  getGroupsBySpeciality(speciality: Speciality):void {
    this.router.navigate(['./group'], {queryParams: {'specialityId': speciality.speciality_id}, relativeTo: this.activatedRoute.parent});
  }

  submitDelete(speciality: Speciality): void {
      this.specialitiesService.delete(speciality['speciality_id'])
        .subscribe(resp => {
          --this.count;
          this.getSpecialities();
            this.toastr.success(`Спеціальність ${speciality.speciality_name} успішно видалена`);
        },
        err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number): void {
    this.page = page;
    this.getSpecialities();
  }

  changeCountPerPage(itemsPerPage: number): void {
    this.countPerPage = itemsPerPage;
    this.getSpecialities();
  }

  startSearch(criteria: string):void {
    if (criteria === '') {
    this.getSpecialities();
    this.getCount();
  } else {
      this.spinnerService.showSpinner();
    this.specialitiesService.searchByName(criteria).subscribe(resp => {
      if (resp['response'] === NO_RECORDS) {
        this.specialities = [];
        this.count = this.specialities.length;
        this.page = 2;
      } else {
        this.count = 0;
        this.page = 2;
        this.specialities = resp;
      }
      this.spinnerService.hideSpinner();
    },
      err => this.router.navigate(['/bad_request']));
  }
  }

}

