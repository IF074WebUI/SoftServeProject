import {Component, OnInit } from '@angular/core';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Test } from './test';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import {ActivatedRoute, Router} from '@angular/router';

declare var $: any;

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
  action: string;
  displayPropertiesOrder: string[];
  constructor(private getAllRecordsService: GetAllRecordsService,
              private getRecordsByIdService: GetRecordsByIdService,
              private route: ActivatedRoute,
              private router: Router,
  ) {}
  ngOnInit() {
    this.getAllTests();
    this.getSubjects();
    this.headers = ['№', 'Назва тесту', 'Предмет', 'Завдання', 'Тривалість тесту', 'Спроби', 'Статус'];
    this.displayPropertiesOrder = ['test_name', 'subject_name', 'tasks', 'time_for_test', 'attempts', 'enabled_description' ];
  }
  getAllTests() {
    this.getAllRecordsService.getAllRecords('test').subscribe((data) => {
      this.tests = data;
      for (const test of this.tests) {
        /*get names of subjects*/
        this.setNameOfSubject(test);
        this.setEnabledDescription(test);
      }
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
    this.router.navigate(['./testDetails'], {queryParams: {'test_id': test.test_id, 'test_name': test.test_name}, relativeTo: this.route.parent});
  }
}
