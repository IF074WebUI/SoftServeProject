import {Component, OnInit, ViewChild} from '@angular/core';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Test } from './test';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetTestsBySubjectService } from '../services/get-tests-by-subject.service';
import { TestsService } from '../services/tests.service';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { TESTS_CONFIG } from '../universal/dynamic-form/config';
import { ToastsManager } from 'ng2-toastr';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';

declare var $: any;

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
  subjectIdQueryParam: string;
  subjectNameQueryParam: string;
  btnClass: string;
  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = TESTS_CONFIG;
  constructor(private getAllRecordsService: GetAllRecordsService,
              private getRecordsByIdService: GetRecordsByIdService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private getTestsBySubjectService: GetTestsBySubjectService,
              private testsService: TestsService,
              private toastsManager: ToastsManager,
              private deleteRecordByIdService: DeleteRecordByIdService) {
    this.btnClass = 'fa fa-venus-double';
  }
  ngOnInit() {
    this.getQueryParams()
    this.getSubjects();
    this.headers = ['№', 'Назва тесту', 'Завдання', 'Тривалість тесту', 'Спроби', 'Статус'];
    this.displayPropertiesOrder = ['test_name', 'tasks', 'time_for_test', 'attempts', 'enabled_description' ];
  }
  getQueryParams() {
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
  getTestDetailsByTest (test: Test) {
    this.router.navigate(['subject/tests/testDetails'], {
      queryParams: {
        'test_id': test.test_id,
        'test_name': test.test_name
      },
      relativeTo: this.activatedRoute.parent
    });
  }
  add() {
    this.popup.sendItem(new Test(), 'test');
    this.popup.showModal();
  }

  edit(test: Test) {
    this.popup.sendItem(test);
    this.popup.showModal();
  }

  del(test: Test) {
    this.popup.deleteEntity(test);
  }

  formSubmitted(inputTest) {
    if (!inputTest.test_id) {
      this.testsService.createTest(inputTest).subscribe(() => {
        this.getTestsForOneSubject();
        this.popup.cancel();
        this.toastsManager.success(`Тест "${inputTest.test_name}" успішно створено.`);
      });
    } else {
      this.testsService.updateTest(inputTest).subscribe(() => {
        this.getTestsForOneSubject();
        this.popup.cancel();
        this.toastsManager.success(`Предмет "${inputTest.test_name}" успішно відредаговано.`);
      });
    }
  }

  deleteTest(deletedTest) {
    this.deleteRecordByIdService.deleteRecordsById('test', deletedTest.test_id).subscribe(() => {
      this.getTestsForOneSubject();
      this.toastsManager.success(`Тест "${deletedTest.subject_name}" успішно видалено.`);
    });
  }
}
