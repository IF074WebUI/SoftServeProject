import { Component, OnInit } from '@angular/core';
import { TimetableService } from './timetable.service';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timeTable = [];

  constructor(private timetableservice: TimetableService, private recordsById: GetRecordsByIdService) { }

  ngOnInit() {
    this.timetableservice.getAllTimeTables().subscribe((data) => {
      this.timeTable = data;
      console.log(this.timeTable);
      /*get names of groups*/
      for (let i = 0; i < this.timeTable.length; i++){
        this.recordsById.getRecordsById('group', this.timeTable[i].group_id).subscribe((groupData) => {
          console.log(groupData);
          this.timeTable[i].group_name = groupData[0].group_name;
        });
      }
      /*get names of subjects*/
      for (let i = 0; i < this.timeTable.length; i++){
        this.recordsById.getRecordsById('subject', this.timeTable[i].subject_id).subscribe((subjectData) => {
          console.log(subjectData);
          this.timeTable[i].subject_name = subjectData[0].subject_name;
        });
      }
    });
  }

}
