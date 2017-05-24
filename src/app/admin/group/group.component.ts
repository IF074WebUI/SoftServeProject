import { Component, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';
import { Faculty } from './Faculty';
import { Speciality } from './speciality';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  groupsOnPage: Group[] = [];
  facultiesOnPage: Faculty[] = [];
  specialitiesOnPage: Speciality[] = [];
  groups: Group = new Group();
  groupforEdit: Group;
  GroupforDelete: Group;
  pageNumber: number = 1;
  offset = 3;
  countRecords: number;
  selectedValue: number;
  selectedFacultyValue: number;
  selectedSpesailutyValue: number;


  constructor(private getGroupsService: GroupService) { }
  ngOnInit() {
    this.uploadPage();

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
  }

  createCroup(groupName: string) {
    this.getGroupsService.createCroup(groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe(() => {this.uploadPage();
      });
  }
  // >>>>>UPDATE PAGE<<<<<<<<<<<
  uploadPage() {
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
      .subscribe((data) => {
        this.groupsOnPage = <Group[]> data;
      });
  }
  // >>>>>>>>>SELECT FOR EDITING<<<<<<<<<<
  selectedGroup(group: Group) {
    this.GroupforDelete = group;
    this.groupforEdit = group;
  }
  // >>>>>>>>>>>>>DELETING<<<<<<<<<<<<<<
  deleteGroup() {
    this.getGroupsService.deleteGroup(this.GroupforDelete['group_id'])
      .subscribe(() => {
        this.uploadPage();
      });
  }
  // >>>>>>>>EDITING<<<<<<<<<<<

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
        .subscribe((resp) => {console.log(resp)} );
    }
  changePage(pageNumber) {
    this.getCountRecords()
    console.log(typeof(this.countRecords));
    if (pageNumber <= 1) {
        this.pageNumber = Math.floor( (this.countRecords / this.offset) )
    } else {
      this.pageNumber = pageNumber
      }
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
      .subscribe((data) => {
        this.groupsOnPage = <Group[]> data;
          });
    }

    getGroupsOnPage() {
        this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
        .subscribe((data) => {
          this.groupsOnPage = <Group[]> data;
        });
    }


}

