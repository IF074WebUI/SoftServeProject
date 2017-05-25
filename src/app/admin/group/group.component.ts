import { Component, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';
import { Faculty } from './Faculty';
import {Speciality} from './speciality';
import {StatisticsService} from '../statistics/statistics.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'dtester-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
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


  constructor(private getGroupsService: GroupService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.uploadPage();
    this.getCountRecords();
    this.getGroupsService
      .getFaculties()
      .subscribe((data) => {
        this.facultiesOnPage = <Faculty[]>data;
      });

    this.getGroupsService
      .getSpeciality()
      .subscribe((data) => {
        this.specialitiesOnPage = <Speciality[]>data;
      });
    let specialityId = this.route.snapshot.queryParams['specialityId'];
    if (specialityId) {
      this.getGroupsService.getGroupsBySpeciality(specialityId).subscribe(resp =>  this.groupsOnPage = resp);
    }
  }

  createCroup(groupName: string) {
    this.getGroupsService.createCroup(groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe(() => {this.uploadPage();
      });
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

