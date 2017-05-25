import { Component, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';
import { Speciality } from '../specialities/speciality';
import { SpecialitiesService } from '../services/specialities.service';
import { FacultyService } from '../faculties/faculty.service';
import { Faculty } from '../faculties/Faculty';

@Component({
  selector: 'dtester-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [FacultyService, SpecialitiesService]
})
export class GroupComponent implements OnInit {
  groupsOnPage: Group[] = [];
  facultiesOnPage: Faculty[] = [];
  specialitiesOnPage: Speciality[] = [];
  groupforEdit: Group;
  groupforDelete: Group;
  pageNumber: number;
  offset = 5;   /*number of the records for the stating page*/
  countRecords: number;
  selectedFacultyValue: number;
  selectedSpesailutyValue: number;


  constructor(private getGroupsService: GroupService, private spesialityService: SpecialitiesService, private facultyService: FacultyService) { }
  ngOnInit() {
    this.uploadPage();
    this.getCountRecords();
    this.facultyService
      .getAllFaculties()
      .subscribe((data) => {
        this.facultiesOnPage = <Faculty[]>data;
      });

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
    this.pageNumber = 1;
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
      .subscribe((data) => {
        this.groupsOnPage = <Group[]> data;
      });
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
    console.log(this.groupforEdit['group_id']);
    this.getGroupsService.editGroup(this.groupforEdit['group_id'], groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe(() => {
        this.uploadPage();
      });
  }
  // >>>>>pagination<<<<<<<<
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
      this.pageNumber = numberOfLastPage
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
}

