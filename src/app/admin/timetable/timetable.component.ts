import { Component, OnInit } from '@angular/core';
import { TimetableService } from './timetable.service';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timetable } from './timetable';
import { Group } from '../group/group';
import { timeValidator } from './time-validator';
import { GetRecordsRangeService } from '../services/get-records-range.service';
import { StatisticsService } from '../statistics/statistics.service';
import { GetRecordsBySearchService } from '../services/get-records-by-search.service';

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
  headers: string[] = ['№', 'Навчальна група', 'Предмет', 'Час початку тестування', 'Час закінчення тестування'];
  recordsPerPage: number;
  page: number;
  countRecords: number;
  ignoreProperties: string[] = ['timetable_id', 'subject_id', 'group_id', 'end_time', 'start_time', 'end_date', 'start_date'];
  constructor(private timetableService: TimetableService,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService,
              private deleteRecordByIdService: DeleteRecordByIdService,
              private getRecordsRangeService: GetRecordsRangeService,
              private statisticsService: StatisticsService,
              private getRecordsBySearchService: GetRecordsBySearchService) {
    this.newTimetableForm = new FormGroup({
      'group_id': new FormControl('', Validators.required),
      'subject_id': new FormControl('', Validators.required),
      'time_limits': new FormGroup({
        'start_date': new FormControl('', Validators.required),
        'start_time': new FormControl('', Validators.required),
        'end_date': new FormControl('', Validators.required),
        'end_time': new FormControl('', Validators.required)
      }, timeValidator)
    });
    this.updateTimetableForm = new FormGroup({
      'group_id': new FormControl('', Validators.required),
      'subject_id': new FormControl('', Validators.required),
      'time_limits': new FormGroup({
        'start_date': new FormControl('', Validators.required),
        'start_time': new FormControl('', Validators.required),
        'end_date': new FormControl('', Validators.required),
        'end_time': new FormControl('', Validators.required)
      }, timeValidator )
    });
  }

  ngOnInit() {
    this.page = 1;
    this.recordsPerPage = 5;
    this.getTimetables();
    this.getGroups();
    this.getSubjects();
    this.getCountRecords();
  }
  getTimetables(): void {
    if (this.countRecords <= (this.page - 1) * this.recordsPerPage) {
      --this.page;
    }
    this.getRecordsRangeService.getRecordsRange('timeTable', this.recordsPerPage, (this.page - 1) * this.recordsPerPage)
      .subscribe((data) => {
      this.timeTables = data;
      for (const timetable of this.timeTables) {
        /*get names of groups*/
        this.getRecordsByIdService.getRecordsById('group', timetable.group_id).subscribe((groupData) => {
          timetable.group_name = groupData[0].group_name;
          /*get names of subjects*/
          this.getRecordsByIdService.getRecordsById('subject', timetable.subject_id).subscribe((subjectData) => {
            timetable.subject_name = subjectData[0].subject_name;
            /*edit date*/
            timetable.end_time = timetable.end_time.slice(0, 5);
            timetable.start_time = timetable.start_time.slice(0, 5);
            timetable.start_timeInterval = `${timetable.start_time}, ${timetable.start_date}`;
            timetable.end_timeInterval = `${timetable.end_time}, ${timetable.end_date}`;
          });
        });
      }
    });
  }
  createTimeTable() {
    this.timetableService.createTimeTable(this.newTimetableForm.value)
      .subscribe(() => {
        this.getTimetables();
        this.newTimetableForm.reset();
      });
  }
  getUpdatedTimetable(timeTable) {
    this.updatedTimetable = timeTable;
    this.updateTimetableForm.setValue({
      'group_id': timeTable.group_id,
      'subject_id': timeTable.subject_id,
      'time_limits': {
        'start_date': timeTable.start_date,
        'start_time': timeTable.start_time,
        'end_date': timeTable.end_date,
        'end_time': timeTable.end_time
      }
    });
  }
  updateTimeTable() {
    this.timetableService.updateTimeTable(this.updateTimetableForm.value, this.updatedTimetable.timetable_id)
      .subscribe(() => {
        this.getTimetables();
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
  getCountRecords() {
    this.statisticsService.getCountRecords('timeTable').subscribe((data) => {
      this.countRecords = data.numberOfRecords;
    });
  }
  changePage(page: number) {
    this.page = page;
    this.getTimetables();
  }
  startSearch(criteria: string) {
    if (criteria === '') {
      this.getTimetables();
      this.getCountRecords();
    } else {
      this.getRecordsBySearchService.getRecordsBySearch('subject', criteria).subscribe(resp => {
          if (resp['response'] === 'no records') {
            this.timeTables = [];
            this.countRecords = this.timeTables.length;
          } else {
            this.countRecords = 0;
            this.page = 2;
            this.timeTables = resp;
          }
        });
    }
  }
}
