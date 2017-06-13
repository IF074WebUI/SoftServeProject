import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { SpecialitiesService } from '../services/specialities.service';
import { Speciality } from './speciality';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { SpinnerService } from '../universal/spinner/spinner.service';
import { SPECIALITY_CONFIG } from '../universal/dynamic-form/config';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})

export class SpecialitiesComponent implements OnInit {

  SPECIALITIES_HEADERS: string[] = ['№', 'назва спеціальності', 'код спеціальності'];
  IGNORE_PROPERTIES: string[] = ['speciality_id'];
  DISPLAY_PROPERTIES_ORDER: string[] = ['speciality_name', 'speciality_code'];
  SORT_PROPERTIES: string[] = ['speciality_name'];
  NO_RECORDS = 'no records';

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

  add() {
    this.popup.sendItem(new Speciality('', ''), 'Speciality');
    this.popup.showModal();
  }

  edit(speciality: Speciality) {
    this.popup.sendItem(speciality);
    this.popup.showModal();
  }

  delete(speciality: Speciality) {
    this.popup.deleteEntity(speciality);
  }

  formSubmitted(speciality: Speciality): void {
    console.log(speciality);
    if (speciality['specility_id']) {
      this.specialitiesService.edit(speciality).subscribe(resp => {
          this.popup.cancel();
          this.getSpecialities();
          this.toastr.success(`Спеціальність ${speciality.speciality_name} успішно відредагована`);
        },
        err => this.router.navigate(['/bad_request']));
    } else {
      this.specialitiesService.save(speciality).subscribe(resp => {
          this.popup.cancel();
          this.getSpecialities();
          this.count++;
          this.toastr.success(`Спеціальність ${speciality.speciality_name} успішно збережена`);
        },
        err => this.router.navigate(['/bad_request']));
    }
  }

  getGroupsBySpeciality(speciality: Speciality) {
    this.router.navigate(['./group'], {queryParams: {'specialityId': speciality.speciality_id}, relativeTo: this.activatedRoute.parent});
  }

  submitDelete(speciality: Speciality) {
    console.log(speciality);
      this.specialitiesService.delete(speciality['speciality_id'])
        .subscribe(resp => {
            this.popup.cancel();
          --this.count;
          this.getSpecialities();
            this.toastr.success(`Спеціальність ${speciality.speciality_name} успішно видалена`);
        },
        err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number) {
    this.page = page;
    this.getSpecialities();
  }

  changeCountPerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getSpecialities();
  }

  startSearch(criteria: string) {
    if (criteria === '') {
    this.getSpecialities();
    this.getCount();
  } else {
      this.spinnerService.showSpinner();
    this.specialitiesService.searchByName(criteria).subscribe(resp => {
      if (resp['response'] === this.NO_RECORDS) {
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

