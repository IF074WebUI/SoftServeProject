import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';
import { Speciality } from '../specialities/speciality';
import { SpecialitiesService } from '../services/specialities.service';
import { FacultyService } from '../faculties/faculty.service';
import { Faculty } from '../faculties/Faculty';
import { ActivatedRoute, Router } from '@angular/router';
import { GROUPS_HEADERS, IGNORE_PROPERTIES } from './groupConstants';

import { SpinnerService } from '../universal/spinner/spinner.service';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { GROUP_CONFIG } from '../universal/dynamic-form/config';

@Component({
  selector: 'dtester-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [FacultyService, SpecialitiesService]
})
export class GroupComponent implements OnInit {

  isLoading: boolean;
  groupsOnPage: Group[];
  pageNumber: number = 1;
  offset = 5;   /*number of the records for the stating page*/
  countRecords: number;
  headers: string[];            /* array of headers */
  ignoreProperties: string[];
  CREATING_NEW_GROUP = 'Додати нову групу';
  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = GROUP_CONFIG;

  constructor(private getGroupsService: GroupService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: SpinnerService
  ) {}
  ngOnInit() {
    this.headers = GROUPS_HEADERS;
    this.ignoreProperties = IGNORE_PROPERTIES;

    this.getGroups();

    // let facultyId = this.route.snapshot.queryParams['facultyId'];
    // console.log(facultyId);
    // if (facultyId) {
    //   this.getGroupsService.getGroupsByFaculty(facultyId).subscribe(resp => {
    //     if (resp['response'] === 'no records') {
    //       this.groupsOnPage = [];
    //     } else {
    //       this.groupsOnPage = resp;
    //     });
    // }

    let specialityId = this.route.snapshot.queryParams['specialityId'];
    if (specialityId) {
      this.getGroupsService.getGroupsBySpeciality(specialityId).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.groupsOnPage = [];
        } else
          this.groupsOnPage = resp;
      });
    }

  }

  getGroups(): void {
    this.spinner.showSpinner();
    this.getCountRecords()
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.countRecords <= (this.pageNumber - 1) * this.offset) {
      --this.pageNumber;
    }
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset).delay(301)
      .subscribe(resp => {this.groupsOnPage = <Group[]>resp, err => this.router.navigate(['/bad_request']);
      this.spinner.hideSpinner();
      });
  }

    getCountRecords() {
      this.getGroupsService.getCountGroups()
        .subscribe(resp => this.countRecords = resp );
    }

  changePage(page: number) {              /* callback method for change page pagination output event */
    this.pageNumber = page;
    this.getGroups();               /* request new groups for new page */
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.offset = numberOfRecords;
    this.pageNumber = 1;
    this.getGroups();
  }
  // get students by group
  getStudentsByGroup(group: Group) {
    this.router.navigate(['./students'], {queryParams: {'group_id': group.group_id}, relativeTo: this.route.parent});
    console.log(group);
  }
    // search group
  startSearch(criteria: string) {   /* callback method for output in search component */
    this.spinner.showSpinner();
    if (criteria === '' || +criteria <= 0 ) {
      this.getGroups();
    } else {
      this.getGroupsService.searchByName(criteria)
        .subscribe(resp => {
          if (resp['response'] === 'no records') {    /* check condition: if no records presented for search criteria */
            this.groupsOnPage = [];
            this.countRecords = this.groupsOnPage.length;
            this.spinner.hideSpinner();
          } else {
            this.countRecords = 0;
            this.pageNumber = 2;
            this.groupsOnPage = resp;
            this.spinner.hideSpinner();
          }
        },
        err => this.router.navigate(['/bad_request']));
    }
  }
  onTimeTableNavigate(group: Group) {
    this.router.navigate(['./timetable'], {queryParams: {'group_id': group.group_id}, relativeTo: this.route.parent});
  }


// Method for opening editing and deleting commo modal window

  add() {
    this.popup.sendItem(new Group('', '', '', ''));
    this.popup.showModal();
  }

  edit(group: Group) {
    this.popup.sendItem(group);
    this.popup.showModal();
  }

  del(group: Group) {
    this.popup.deleteEntity(group);
  }
  // Method for  add/edit, delete form submiting

  formSubmitted(value) {
    console.log(value);
    if (value['group_id']) {
      this.getGroupsService.editGroup(+value['group_id'], value['group_name'], value['Faculty'], value['Speciality'])
        .subscribe(response => {
          this.getGroups();
          this.popup.cancel();
        },
        error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['faculty_name']}, relativeTo: this.route.parent})
      );
    } else {
          this.getGroupsService.createCroup(value['group_name'], value['Speciality'], value['Faculty'])
            .subscribe(response => {
              this.getGroups();
              this.popup.cancel();
        },
        error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['faculty_name']}, relativeTo: this.route.parent})
      );
    }
  }


  submitDelete(group: Group) {
    this.getGroupsService.deleteGroup(group['group_id']).subscribe(response => this.getGroups(),
      error => this.router.navigate(['/bad_request'])
    );
  }

}

