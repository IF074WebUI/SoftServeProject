import { Component, OnInit } from '@angular/core';
import { TimetableService } from './timetable.service';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timeTables = [];

  constructor(private timetableservice: TimetableService, private recordsById: GetRecordsByIdService) { }

  ngOnInit() {
    this.getTimetables();
  }

  getTimetables() {
    this.timetableservice.getAllTimeTables().subscribe((data) => {
      this.timeTables = data;
      console.log(this.timeTables);
      for (const timetable of this.timeTables) {
        /*get names of groups*/
        this.recordsById.getRecordsById('group', timetable.group_id).subscribe((groupData) => {
          /*console.log(groupData);*/
          timetable.group_name = groupData[0].group_name;
        });
        /*get names of subjects*/
        this.recordsById.getRecordsById('subject', timetable.subject_id).subscribe((subjectData) => {
          /*console.log(subjectData);*/
          timetable.subject_name = subjectData[0].subject_name;
        });
        /*edit date*/
        timetable.end_time = timetable.end_time.slice(0, 5);
        timetable.start_time = timetable.start_time.slice(0, 5);
      }
    });
  }

  createTimeTable(groupId, subjectId, startDate, startTime, endDate, endTime) {
    this.timetableservice.createTimeTable(groupId, subjectId, startDate, startTime, endDate, endTime)
      .subscribe((data) => {
        console.log(data);
      });
    this.getTimetables();
  }





}
