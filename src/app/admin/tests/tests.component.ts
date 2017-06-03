import { Component, OnInit } from '@angular/core';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Test } from './test';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TestsService } from '../services/tests.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  tests: Test[] = [];
  subjects = [];
  headers: string[];
  displayPropertiesOrder: string[];
  newTestForm: FormGroup;
  constructor(private getAllRecordsService: GetAllRecordsService,
              private getRecordsByIdService: GetRecordsByIdService,
              private testsService: TestsService) {
    this.newTestForm = new FormGroup({
      'test_name': new FormControl('', Validators.required),
      'tasks': new FormControl('', Validators.required),
      'time_for_test': new FormControl('', Validators.required),
      'enabled': new FormControl('', Validators.required),
      'attempts': new FormControl('', Validators.required),
      'subject_id': new FormControl('', Validators.required)
    });
  }
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
      console.log(this.tests);
    });
  }
  createTest() {
    this.testsService.createTest(this.newTestForm.value)
      .subscribe(() => {
        this.getAllTests();
        this.newTestForm.reset();
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

}
