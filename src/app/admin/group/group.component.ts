import { Component, OnInit } from '@angular/core';
import { Response} from '@angular/http';
import { GroupService } from './group.service';
import { Group } from './group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  groupsOnPage: Group[] = [];
  groups: Group = new Group();
  ItemforEdit: Group;
  ItemforDelete: Group;

  constructor(private getGroupsService: GroupService) { }

  ngOnInit() {
    this.getGroupsService
      .getGroups()
      .subscribe((data) => {
        this.groupsOnPage = <Group[]>data;
        for (let i =0; i< this.groupsOnPage.length; i++){
        console.log(this.groupsOnPage[i].group_name);}
      });
  }

}
