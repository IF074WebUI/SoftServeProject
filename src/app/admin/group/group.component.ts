import { Component, OnInit } from '@angular/core';
import { Response} from '@angular/http';
import { GroupService } from './group.service';
import { Group } from './group';
import {Faculty} from './Faculty';
import {Speciality} from './speciality';
import {StatisticsService} from '../statistics/statistics.service';
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
  numberOfrecords: number;
  pageNumber = 1;
  offset = 5;
  selectedValue: number;
  selectedFacultyValue: number;
  selectedSpesailutyValue: number;


  constructor(private getGroupsService: GroupService, private statictic: StatisticsService) { }
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
        console.log(this.selectedValue);
    this.getGroupsService.createCroup(groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe((data) => {
        console.log(data);
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
      .subscribe((data) => console.log(data));

  }
  // >>>>>>>>EDITING<<<<<<<<<<<

  editGroup(groupName: string) {
    console.log(this.groupforEdit['group_id']);
    this.getGroupsService.editGroup(this.groupforEdit['group_id'], groupName, this.selectedSpesailutyValue, this.selectedFacultyValue)
      .subscribe((data) => console.log(data));
  }
  // >>>>>pagination<<<<<<<<
    getCountRecords(entity) {
      this.statictic.getCountRecords(entity).subscribe((data) =>  {this.numberOfrecords = data.numberOfRecords; } );

    }

    getGroupsOnPage() {
        this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset)
        .subscribe((data) => {
          this.groupsOnPage = <Group[]> data;
        });
    }

}

