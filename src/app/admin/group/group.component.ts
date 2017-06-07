import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';
import { Speciality } from '../specialities/speciality';
import { SpecialitiesService } from '../services/specialities.service';
import { FacultyService } from '../faculties/faculty.service';
import { Faculty } from '../faculties/Faculty';
import { ActivatedRoute, Router } from '@angular/router';
import {GROUPS_HEADERS, IGNORE_PROPERTIES} from './groupConstants';

import {SpinnerService} from '../universal/spinner/spinner.service';
import {AddeditComponent} from '../addedit/addedit.component';
@Component({
  selector: 'dtester-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [FacultyService, SpecialitiesService]
})
export class GroupComponent implements OnInit {
  @ViewChild(AddeditComponent) popup: AddeditComponent<Group>;

  isLoading: boolean;
  groupsOnPage: Group[];
  facultiesOnPage: Faculty[] = [];
  specialitiesOnPage: Speciality[] = [];
  groupforEdit: Group;
  groupforDelete: Group;
  selectetGroup: Group;
  pageNumber: number = 1;
  offset = 5;   /*number of the records for the stating page*/
  countRecords: number;
  selectedFacultyValue: number;
  selectedSpesailutyValue: number;
  headers: string[];            /* array of headers */
  ignoreProperties: string[];


  constructor(private getGroupsService: GroupService,
              private spesialityService: SpecialitiesService,
              private facultyService: FacultyService,
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

  createCroup(groupName: string) {
    this.getGroupsService.createCroup(groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe(() => {this.getGroups();
      });
  }
  // get Specialities and Faculties
  getSpecialities() {
    this.spesialityService.getAll()
      .subscribe((data) => this.specialitiesOnPage = <Speciality[]>data);
  }
  getFaculties() {
    this.facultyService.getAllFaculties()
      .subscribe( (data) => this.facultiesOnPage = <Faculty[]>data );
  }

  getGroups(): void {
    this.spinner.showSpinner();
    this.isLoading = true;
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
// select for editing
  selectedGroup(group: Group) {
    this.groupforDelete = group;
    this.groupforEdit = group;
  }
// deleting groups
  deleteGroup() {

  }
// editing groups
  editGroup(groupName: string) {
    this.getGroupsService.editGroup(this.groupforEdit['group_id'], groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe(() => {
        this.getGroups();
        this.getGroups();
      });
  }
  // pagination
    getCountRecords() {
      this.getGroupsService.getCountGroups()
        .subscribe(resp => this.countRecords = resp );
    }
  previousPage() {
    this.getCountRecords();
    let numberOfLastPage: number;
    numberOfLastPage = Math.ceil(+this.countRecords / this.offset);
    if (this.pageNumber > 1 ) {
      this.pageNumber--;
    } else {
      this.pageNumber = numberOfLastPage;
    }
    this.getGroups();
    }

  nextPage() {
    this.getCountRecords();
    let numberOfLastPage: number;
    numberOfLastPage = Math.ceil(+this.countRecords / this.offset);
    if (this.pageNumber < numberOfLastPage) {
      this.pageNumber++;
    } else {
      this.pageNumber = 1;
    }
    this.getGroups();
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
    if (criteria === '') {
      this.getGroups();
    } else {
      this.isLoading = true;
      this.getGroupsService.searchByName(criteria).subscribe(resp => {
          if (resp['response'] === 'no records') {    /* check condition: if no records presented for search criteria */
            this.groupsOnPage = [];
            this.countRecords = this.groupsOnPage.length;
            this.spinner.hideSpinner();
          } else {
            this.groupsOnPage = <Group[]>resp;
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
    this.popup.showModal('add', 'group', new Group(null, '', null, null) );
  }
  edit(group: Group) {
    this.popup.showModal('edit', 'group', group );
  }
  del(group: Group) {
    this.popup.showModal('delete', 'group', group);
  }

  // Confirm methods for add, edit, delete faculty

  confirmAdd(entity: Group) {
    console.log(entity);
  }
  confirmEdit(entity: Group) {
    console.log(entity);

  }
  confirmDelete(group: Group) {
    console.log(group);
  };

}

