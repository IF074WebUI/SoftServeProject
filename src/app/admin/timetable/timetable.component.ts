import { Component, OnInit } from '@angular/core';
import { TimetableService } from './timetable.service';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timetable } from  './timetable';
import { Group } from '../group/group';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timeTables: Timetable[] = [];
  groups: Group[] = [];
  subjects = [];
  newTimetableForm: FormGroup;
  updateTimetableForm: FormGroup;
  deletedTimetable: Timetable;
  updatedTimetable: Timetable;

  constructor(private timetableService: TimetableService,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService,
              private deleteRecordByIdService: DeleteRecordByIdService) { }

  ngOnInit() {
    this.newTimetableForm = new FormGroup({
      'group_id': new FormControl('', Validators.required),
      'subject_id': new FormControl('', Validators.required),
      'time_limits': new FormGroup({
        'start_date': new FormControl('', Validators.required),
        'start_time': new FormControl('', Validators.required),
        'end_date': new FormControl('', Validators.required),
        'end_time': new FormControl('', Validators.required)
      })
    });
    this.updateTimetableForm = new FormGroup({
      'group_id': new FormControl('', Validators.required),
      'subject_id': new FormControl('', Validators.required),
      'time_limits': new FormGroup({
        'start_date': new FormControl('', Validators.required),
        'start_time': new FormControl('', Validators.required),
        'end_date': new FormControl('', Validators.required),
        'end_time': new FormControl('', Validators.required)
      })
    });
    this.getTimetables();
    this.getGroups();
    this.getSubjects();
  }

  getTimetables() {
    this.getAllRecordsService.getAllRecords('timeTable').subscribe((data) => {
      this.timeTables = data;
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
  createTimeTable() {
    console.log(this.newTimetableForm);
    this.timetableService.createTimeTable(this.newTimetableForm.value)
      .subscribe(() => {
        this.getTimetables();
      });
  }
  getUpdatedTimetable(timeTable) {
    console.log(timeTable);
    this.updatedTimetable = timeTable;
    this.updateTimetableForm.controls['group_id'].setValue(timeTable.group_id);
    this.updateTimetableForm.controls['subject_id'].setValue(timeTable.subject_id);
    this.updateTimetableForm.controls['time_limits'].controls['start_date'].setValue(timeTable.start_date);
    this.updateTimetableForm.controls['time_limits']['start_time'].setValue(timeTable.start_time);
    this.updateTimetableForm.controls['time_limits']['end_date'].setValue(timeTable.end_date);
    this.updateTimetableForm.controls['time_limits']['end_time'].setValue(timeTable.end_time);
  }
  updateTimeTable() {
    console.log(this.newTimetableForm);
    this.timetableService.updateTimeTable(this.updateTimetableForm.value, this.updatedTimetable.timetable_id)
      .subscribe(() => {
        this.getTimetables();
        this.updateTimetableForm.reset();
      });
  }
  getDeletedTimetable(timeTable) {
    this.deletedTimetable = timeTable;
  }
  deleteTimetable() {
    this.deleteRecordByIdService.deleteRecordsById('timeTable', this.deletedTimetable.timetable_id)
      .subscribe(() => {
        this.getTimetables();
      });
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
  /*timeValidator(control: FormControl): {[s: string]: boolean} {}*/
}
