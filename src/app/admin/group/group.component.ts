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
  GroupforEdit: Group;
  GroupforDelete: Group;
  numberOfrecords: number;
  pageNumberForLoad = 1;
  numberPagesForTheLoad = 20;
  constructor(private getGroupsService: GroupService, private statictic: StatisticsService) { }
  ngOnInit() {
     this.getGroupsService.getPaginatedPage(this.pageNumberForLoad, this.numberPagesForTheLoad)
      .subscribe((data) => {
      this.groupsOnPage = <Group[]> data;
    })

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
    this.changePage(this.pageNumberForLoad, this.numberPagesForTheLoad);
  }

  // >>>>>>>>>SELECT FOR EDITING<<<<<<<<<<
  selectedGroup(group: Group) {
    this.GroupforDelete = group;
    this.GroupforEdit = group;
  }
  // >>>>>>>>>>>>>DELETING<<<<<<<<<<<<<<
  deleteGroup() {
    this.getGroupsService.deleteGroup(this.GroupforDelete['group_id']).subscribe((data) => console.log(data));
    this.changePage(this.pageNumberForLoad, this.numberPagesForTheLoad);
    console.log(this.GroupforDelete['group_id']);
  }
  // >>>>>pagination<<<<<<<<
    getCountRecords(entity) {
      this.statictic.getCountRecords(entity).subscribe((data) =>  {this.numberOfrecords = data.numberOfRecords; } );

    }
    changePage(pageNumberForLoad, numberPagesForTheLoad) {
      this.getGroupsService.getPaginatedPage(pageNumberForLoad, numberPagesForTheLoad)
        .subscribe((data) => {
          this.groupsOnPage = <Group[]> data;
    });
    }

    nextPage(entity) {
    this.getCountRecords(entity);
    if (this.numberOfrecords / this.numberPagesForTheLoad < this.pageNumberForLoad) {} else { this.numberOfrecords += 1;  };
    this.changePage(this.pageNumberForLoad, this.numberPagesForTheLoad);
    }

    deleteGroupsBySpecialyty(id) {
    this.getGroupsService.deleteGroupsBySpesialytyId(id);
    }
}

