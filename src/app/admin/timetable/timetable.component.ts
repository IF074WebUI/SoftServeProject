import { Component, OnInit } from '@angular/core';
import { TimetableService } from './timetable.service';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Timetable } from './timetable';
import { Group } from '../group/group';
import { GetRecordsRangeService } from '../services/get-records-range.service';
import { StatisticsService } from '../statistics/statistics.service';
import { ActivatedRoute, Params } from '@angular/router';
import { arrFromSrtToNum } from './time-validator';
import { Subject } from '../subject/subject';
import {SpinnerService} from "../universal/spinner/spinner.service";

declare var $: any;

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timeTables: Timetable[] = [];
  groups: Group[] = [];
  subjects: Subject[] = [];
  deletedTimetable: Timetable;
  updatedTimetable: Timetable;
  headers: string[];
  displayPropertiesOrder: string[];
  recordsPerPage: number;
  page: number;
  numberOfRecords: number;
  groupQueryParam: string;
  subjectIdQueryParam: string;
  subjectNameQueryParam: string;
  action: string;
  constructor(private timetableService: TimetableService,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService,
              private getRecordsRangeService: GetRecordsRangeService,
              private statisticsService: StatisticsService,
              private activatedRoute: ActivatedRoute,
              private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.page = 1;
    this.recordsPerPage = 5;
    this.getGroups();
    this.getSubjects();
    this.getCountRecords();
    this.getQueryParams();
  }
  getQueryParams() {
    this.spinnerService.showSpinner();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.groupQueryParam = params['group_id'];
      this.subjectIdQueryParam = params['subject_id'];
      this.subjectNameQueryParam = params['subject_name'];
      this.checkQueryParams();
    });
  }
  checkQueryParams() {
    if (this.groupQueryParam) {
      this.getTimetableForOneGroup();
      this.headers = ['№', 'Предмет', 'Час початку тестування', 'Час закінчення тестування'];
      this.displayPropertiesOrder = ['subject_name', 'start_timeInterval', 'end_timeInterval'];
    } else if (this.subjectIdQueryParam) {
      this.getTimetableForOneSubject();
      this.headers = ['№', 'Навчальна група', 'Час початку тестування', 'Час закінчення тестування'];
      this.displayPropertiesOrder = ['group_name', 'start_timeInterval', 'end_timeInterval'];
    } else {
      this.getTimetablesRange();
      this.headers = ['№', 'Навчальна група', 'Предмет', 'Час початку тестування', 'Час закінчення тестування'];
      this.displayPropertiesOrder = ['group_name', 'subject_name', 'start_timeInterval', 'end_timeInterval'];
    }
  }
  getTimetablesRange(): void {
    if (this.numberOfRecords <= (this.page - 1) * this.recordsPerPage) {
      --this.page;
    }
    this.getRecordsRangeService.getRecordsRange('timeTable', this.recordsPerPage, (this.page - 1) * this.recordsPerPage)
      .subscribe((data) => {
        this.getTimetables(data);
    });
  }
  getTimetableForOneGroup() {
    this.timetableService.getTimeTablesForGroup(this.groupQueryParam).subscribe((data) => {
      this.getTimetables(data);
    });
  }
  getTimetableForOneSubject() {
    this.timetableService.getTimeTablesForSubject(this.subjectIdQueryParam).subscribe((data) => {
      this.getTimetables(data);
    });
  }
  getTimetables(data) {
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
      timetable.start_timeInterval = `${timetable.start_time}, ${timetable.start_date}`;
      timetable.end_timeInterval = `${timetable.end_time}, ${timetable.end_date}`;
      timetable.deprecated = this.checkTime(timetable.end_date, timetable.end_time );
      this.spinnerService.hideSpinner();
    }
  }
  openModalAddTimetable() {
    $('#add-update-timetable').modal('show');
    this.action = 'add';
  }
  getUpdatedTimetable(timeTable) {
    $('#add-update-timetable').modal('show');
    this.updatedTimetable = timeTable;
    this.action = 'update';
  }
  getDeletedTimetable(timeTable) {
    this.deletedTimetable = timeTable;
    $('#modal-delete-timetabel').modal('show');
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
      this.numberOfRecords = data.numberOfRecords;
    });
  }
  changePage(page: number) {
    this.page = page;
    this.checkQueryParams();
  }
  changeNumberOfRecords(status: string) {
    if (status === 'deletingRecord') {
      this.numberOfRecords--;
    } else if (status === 'addingRecord') {
      this.numberOfRecords++;
    }
    this.checkQueryParams();
  }
  changeNumberOfRecordsPerPage(newNumberOfRecordsPerPage: number) {
    this.recordsPerPage = newNumberOfRecordsPerPage;
    this.getTimetablesRange();
  }
  checkTime(end_date, end_time) {
    const endDateArr: string[] = end_date.split('-');
    const endTimeArr: string[] = end_time.split(':');
    const endTimeIntervalArr: number[] = arrFromSrtToNum(endDateArr.concat(endTimeArr));
    endTimeIntervalArr[1]--;
    const endTimeInterval = +new Date(
      endTimeIntervalArr[0],
      endTimeIntervalArr[1],
      endTimeIntervalArr[2],
      endTimeIntervalArr[3],
      endTimeIntervalArr[4]);
    const now = Date.now();
    if ( now < endTimeInterval) {
      return false;
    } else {
      return true;
    }
  }
}
