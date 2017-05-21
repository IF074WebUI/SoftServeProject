import { Component, OnInit } from '@angular/core';
import { Response} from '@angular/http';
import { GroupService } from './group.service';
import { Group } from './group';
import {Faculty} from './Faculty';
import {Speciality} from './speciality';
import { Ng2CompleterModule } from "ng2-completer";
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
  GroupforEdit: Group;
  GroupforDelete: Group;

  constructor(private getGroupsService: GroupService) { }

  ngOnInit() {
    this.getGroupsService
      .getGroups()
      .subscribe((data) => {
        this.groupsOnPage = <Group[]>data;
      });

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

  createCroup(facultyId, specialytyId, groupname) {
    this.getGroupsService.createCroup(facultyId, specialytyId, groupname)
      .subscribe((data) => {
        console.log(data);
      });
      this.pageReload();
  }
  // >>>>>>>>>>>>>>Page Reload<<<<<<<<<<
  pageReload() {
    this.getGroupsService
      .getGroups()
      .subscribe((data) => {
        this.groupsOnPage = <Group[]>data;
      });
  }
  // >>>>>>>>>EDIDTING<<<<<<<<<<
  selectedGroup(group: Group) {
    this.GroupforDelete = group;
    this.GroupforEdit = group;
  }



}
