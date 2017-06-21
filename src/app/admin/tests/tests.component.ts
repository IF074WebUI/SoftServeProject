import { Component, OnInit } from '@angular/core';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Test } from './test';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetTestsBySubjectService } from '../services/get-tests-by-subject.service';
import { SpinnerService } from '../universal/spinner/spinner.service';

declare let $: any;

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  tests: Test[] = [];
  subjects = [];
  updatedTest: Test;
  deletedTest: Test;
  headers: string[];
  displayPropertiesOrder: string[];
  action: string;
  subjectIdQueryParam: string;
  subjectNameQueryParam: string;
  btnClass: string;
  sortProperties: string[];
  constructor(private getAllRecordsService: GetAllRecordsService,
              private getRecordsByIdService: GetRecordsByIdService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private getTestsBySubjectService: GetTestsBySubjectService,
              private spinnerService: SpinnerService) {
    this.btnClass = 'fa fa-align-justify';
  }
  ngOnInit() {
    this.getQueryParams();
    this.getSubjects();
    this.headers = ['№', 'Назва тесту', 'Завдання', 'Тривалість тесту', 'Спроби', 'Статус'];
    this.displayPropertiesOrder = ['test_name', 'tasks', 'time_for_test', 'attempts', 'enabled_description' ];
    this.sortProperties = ['test_name'];
  }
  getQueryParams() {
    this.spinnerService.showSpinner();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.subjectIdQueryParam = params['subject_id'];
      this.subjectNameQueryParam = params['subject_name'];
      this.getTestsForOneSubject();
    });
  }
  getTestsForOneSubject() {
    this.getTestsBySubjectService.getTestsBySubject(this.subjectIdQueryParam).subscribe((data) => {
      this.tests = data;
      for (const test of this.tests) {
        this.setNameOfSubject(test);
        this.setEnabledDescription(test);
      }
      this.spinnerService.hideSpinner();
    });
  }
  getSubjects() {
    this.getAllRecordsService.getAllRecords('subject').subscribe((data) => {
      this.subjects = data;
    });
  }
  setNameOfSubject(test: Test) {
    this.getRecordsByIdService.getRecordsById('subject', test.subject_id).subscribe((subjectData) => {
      test.subject_name = subjectData[0].subject_name;
    });
  }
  setEnabledDescription(test: Test) {
    if (test.enabled == 0) {
      test.enabled_description = 'Недоступно';
    } else {
      test.enabled_description = 'Доступно';
    }
  }
  openModalAddTest() {
    $('#add-update-test').modal('show');
    this.action = 'add';
  }
  getUpdatedTest(test: Test) {
    this.updatedTest = test;
    this.action = 'update';
    $('#add-update-test').modal('show');
  }
  getDeletedTest(test: Test) {
    this.deletedTest = test;
    $('#delete-test').modal('show');
  }

  getTestDetailsByTest (test: Test) {
    this.router.navigate(['subject/tests/testDetails'], {
      queryParams: {
        'test_id': test.test_id,
        'test_name': test.test_name
      },
      relativeTo: this.activatedRoute.parent
    });
  }

  goToQuestions(test: Test) {
    this.router.navigate(['subject/tests/questions'], {queryParams: {'test_id': test.test_id}, relativeTo: this.activatedRoute.parent});
  }
}
