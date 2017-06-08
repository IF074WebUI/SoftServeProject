import { Component, OnInit } from '@angular/core';
import { Subject } from './subject';
import { StatisticsService } from '../statistics/statistics.service';
import { GetRecordsRangeService } from '../services/get-records-range.service';
import { GetRecordsBySearchService } from '../services/get-records-by-search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  headers: string[];
  displayPropertiesOrder: string[];
  numberOfRecords: number;
  recordsPerPage: number;
  page: number;
  constructor(private statisticsService: StatisticsService,
              private getRecordsRangeService: GetRecordsRangeService,
              private getRecordsBySearchService: GetRecordsBySearchService,
              private router: Router) { }

  ngOnInit() {
    this.page = 1;
    this.recordsPerPage = 7;
    this.getCountRecords();
    this.getSubjectsRange();
    this.headers = ['№', 'Назва предмету', 'Опис' ];
    this.displayPropertiesOrder = ['subject_name', 'subject_description'];
  }
  getSubjectsRange() {
    if (this.numberOfRecords <= (this.page - 1) * this.recordsPerPage) {
      --this.page;
    }
    this.getRecordsRangeService.getRecordsRange('subject', this.recordsPerPage, (this.page - 1) * this.recordsPerPage)
      .subscribe((data) => {
        this.subjects = data;
      });
  }
  getCountRecords() {
    this.statisticsService.getCountRecords('subject').subscribe((data) => {
      this.numberOfRecords = data.numberOfRecords;
    });
  }
  changePage(page: number) {
    this.page = page;
    this.getSubjectsRange();
  }
  startSearch(criteria: string) {
    if (criteria === '') {
      this.getSubjectsRange();
      this.getCountRecords();
    } else {
      this.getRecordsBySearchService.getRecordsBySearch('subject', criteria).subscribe(resp => {
          if (resp['response'] === 'no records') {
            this.subjects = [];
            this.numberOfRecords = this.subjects.length;
          } else {
            this.numberOfRecords = 0;
            this.page = 2;
            this.subjects = resp;
          }
        },
        err => this.router.navigate(['/bad_request']));
    }
  }

}
