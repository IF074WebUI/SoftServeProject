import { Component, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [GroupService]
})
export class GroupComponent implements OnInit {
  groups: any ;

  constructor(private getGroups: GroupService) { }
  getGroups(): Promise<Group[]> {
    return Promise.resolve(GROUPS);
  }
  ngOnInit() {

  }

}
