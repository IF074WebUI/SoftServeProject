import { Component, OnInit } from '@angular/core';
import { Response} from '@angular/http';
import { GroupService } from './group.service';
import { Group } from './group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [GroupService]
})
export class GroupComponent implements OnInit {
  groups: Group[]= [] ;

  constructor(private getGroups: GroupService) { }
  ngOnInit() {
    this.getGroups.getGroups()
      .subscribe((data: Response) => this.groups = data.json());
  }

}
