import { Component, OnInit } from '@angular/core';
import { TimetableService } from './timetable.service';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timeTables = [];
  groups = [];
  subjects = [];
  selectedTimetable;

  constructor(private timetableservice: TimetableService,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService,
              private deleteRecordByIdService: DeleteRecordByIdService) { }

  ngOnInit() {
    this.getTimetables();
    this.getGroups();
    this.getSubjects();
  }

  getTimetables() {
    this.getAllRecordsService.getAllRecords('timeTable').subscribe((data) => {
      this.timeTables = data;
      console.log(this.timeTables);
      for (const timetable of this.timeTables) {
        /*get names of groups*/
        this.getRecordsByIdService.getRecordsById('group', timetable.group_id).subscribe((groupData) => {
          timetable.group_name = groupData[0].group_name;
        });
        /*get names of subjects*/
        this.getRecordsByIdService.getRecordsById('subject', timetable.subject_id).subscribe((subjectData) => {
          timetable.subject_name = subjectData[0].subject_name;
        });
        /*edit date*/
        timetable.end_time = timetable.end_time.slice(0, 5);
        timetable.start_time = timetable.start_time.slice(0, 5);
      }
    });
  }

  getSelectedTimetable(timetable) {
    this.selectedTimetable = timetable;
  }

  deleteTimetable() {
    this.deleteRecordByIdService.deleteRecordsById('timeTable', this.selectedTimetable.timetable_id).subscribe((data) => {
      console.log(data);
    });
    this.getTimetables();
  }

  createTimeTable(groupId, subjectId, startDate, startTime, endDate, endTime) {
    this.timetableservice.createTimeTable(groupId, subjectId, startDate, startTime, endDate, endTime)
      .subscribe((data) => {
        console.log(data);
      });
    this.getTimetables();
  }
  updateTimeTable(timetable_id, groupId, subjectId, startDate, startTime, endDate, endTime) {
    this.timetableservice.updateTimeTable(timetable_id, groupId, subjectId, startDate, startTime, endDate, endTime)
      .subscribe((data) => {
        console.log(data);
      });
    this.getTimetables();
  }
  getGroups() {
    this.getAllRecordsService.getAllRecords('group').subscribe((data) => {
      this.groups = data;
    });
  }
  getSubjects() {
    this.getAllRecordsService.getAllRecords('subject').subscribe((data) => {
      this.subjects = data;
    });
  }
}
