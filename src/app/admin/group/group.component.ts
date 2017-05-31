import { Component, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';
import { Speciality } from '../specialities/speciality';
import { SpecialitiesService } from '../services/specialities.service';
import { FacultyService } from '../faculties/faculty.service';
import { Faculty } from '../faculties/Faculty';
import { ActivatedRoute, Router } from '@angular/router';
import {GROUPS_HEADERS, IGNORE_PROPERTIES} from './groupConstants';
@Component({
  selector: 'dtester-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [FacultyService, SpecialitiesService]
})
export class GroupComponent implements OnInit {
  isLoading: boolean = true;
  groupsOnPage: Group[];
  facultiesOnPage: Faculty[] = [];
  specialitiesOnPage: Speciality[] = [];
  groupforEdit: Group;
  groupforDelete: Group;
  NO_RECORDS: string = 'no records';
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
              private router: Router ) {}
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
          this.groupsOnPage = resp
      });
    }

  }

  createCroup(groupName: string) {
    this.getGroupsService.createCroup(groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe(() => {this.uploadPage();
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
// updatePage
  uploadPage() {
    this.getCountRecords();
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
      .subscribe((data) => {
        this.groupsOnPage = <Group[]> data;
      });
  }

  getGroups(): void {
    this.getCountRecords()
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.countRecords <= (this.pageNumber - 1) * this.offset) {
      --this.pageNumber;
    }
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
      .subscribe(resp => {this.groupsOnPage = <Group[]>resp; this.isLoading = false;  });
  }
// select for editing
  selectedGroup(group: Group) {
    this.groupforDelete = group;
    this.groupforEdit = group;
  }
// deleting groups
  deleteGroup() {
    this.getGroupsService.deleteGroup(this.groupforDelete['group_id'])
      .subscribe(() => {
        this.uploadPage();
      });
  }
// editing groups
  editGroup(groupName: string) {
    this.getGroupsService.editGroup(this.groupforEdit['group_id'], groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe(() => {
        this.uploadPage();
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
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
      .subscribe((data) => {
        this.groupsOnPage = <Group[]> data;
          });
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
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
      .subscribe((data) => {
        this.groupsOnPage = <Group[]> data;
      });
  }

  changePage(page: number) {              /* callback method for change page pagination output event */
    this.pageNumber = page;
    this.getGroups();               /* request new groups for new page */
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.offset = numberOfRecords;
    this.pageNumber = 1;
    this.uploadPage();
  }
  // get students by group
  getStudentsByGroup(group: Group) {
    this.router.navigate(['./students'], {queryParams: {'group_id': group.group_id}, relativeTo: this.route.parent});
    console.log(group);
  }
    // search group
  startSearch(criteria: string) {         /* callback method for output in search component */
    this.getGroupsService.searchByName(criteria).subscribe(resp => {
        if (resp['response'] === this.NO_RECORDS) {    /* check condition: if no records presented for search criteria */
          this.groupsOnPage = [];
          this.countRecords = this.groupsOnPage.length;
          console.log(this.countRecords);
        } else {
          this.groupsOnPage = [];
          this.pageNumber = 1;
          this.countRecords = resp.length; /* if records are present than set groups count to calculate pagination pages */
          this.groupsOnPage = <Group[]> resp;  /* present only paginated groups */
          console.log(this.countRecords);
        }
      },
      err => this.router.navigate(['/bad_request']));
  }

  /*
 Made by Olena (method how to open universal component)

  addGroupUniversal() {
    this.router.navigate(['/admin/addedit'], {
      queryParams: {
        'id': 0,
        'name': 0,
        'description': '',
        'entity': 'group'      }
    });
  }
   */

}

