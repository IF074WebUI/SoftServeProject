import { Component, OnInit, ViewChild } from '@angular/core';
import { SpecialitiesService } from '../services/specialities.service';
import { Speciality } from './speciality';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})

export class SpecialitiesComponent implements OnInit {

  SPECIALITIES_HEADERS: string[] = ['пор.номер', 'код спеціальності', 'назва спеціальності', 'дії'];
  IGNORE_PROPERTIES: string[] = ['speciality_id'];
  NO_RECORDS: string = 'no records';
  SPECIALITIES_HEADER: string = 'Спеціальності';
  SPECIALITIES_ADD_TITLE: string = 'Додати спеціальність';
  FIRST_DROPDOWN_ITEM: number = 5;
  SECOND_DROPDOWN_ITEM: number = 10;
  THIRD_DROPDOWN_ITEM: number = 20;
  MODAL_TITLE: string = 'Додати (редагувати) спеціальність';

  specialities: Speciality[];   /* array of specialities that will be displayed on current page */
  page = 1;                     /* current page */
  count: number;                /* count of all specialities */
  countPerPage = 5;             /* count of specialities per page */
  headers: string[];            /* array of headers */
  ignoreProperties: string[];
  editName: string = '';
  @ViewChild(PopupComponent) popup: PopupComponent;

  constructor(private specialitiesService: SpecialitiesService, private router: Router,
   private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.headers = this.SPECIALITIES_HEADERS;
    this.ignoreProperties = this.IGNORE_PROPERTIES;
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
    this.popup.showModal('add', new Speciality('', ''));
  }

  edit(speciality: Speciality) {
    this.popup.showModal('edit', speciality);
  }

  del(speciality: Speciality) {
    this.popup.showModal('confirm', speciality);
  }

  saveSpeciality(speciality: Speciality): void {
    this.specialitiesService.save(speciality).subscribe(resp => {
        this.popup.hideModal();
        this.getSpecialities();             /* after add speciality get all specialities from backend */
        this.count++;
      },
      err => this.router.navigate(['/bad_request']));
  }

  editSpeciality(speciality: Speciality): void {
    this.specialitiesService.edit(speciality).subscribe(resp => {
        this.popup.hideModal();
        this.getSpecialities();             /* after update speciality get all specialities from backend */
      },
      err => this.router.navigate(['/bad_request']));
  }

  getGroupsBySpeciality(speciality: Speciality) {
    this.router.navigate(['./group'], {queryParams: {'specialityId': speciality.speciality_id}, relativeTo: this.activatedRoute.parent});
  }

  deleteSpeciality(speciality: Speciality) {
      this.specialitiesService.delete(speciality['speciality_id'])
        .subscribe(resp => {
            this.popup.hideModal();
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
      if (resp['response'].toString() === this.NO_RECORDS) {    /* check condition: if no records presented for search criteria */
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

