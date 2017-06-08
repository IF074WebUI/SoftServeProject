import {Component, OnInit, ViewChild} from '@angular/core';
import { TestDetailService } from './test-detail.service';
import { TestDetail } from './testDetail';
import { TEST_DETAIL_HEADERS, IGNORE_PROPERTIES } from './testDetailConsntants';
import {ActivatedRoute, Router} from '@angular/router';
import { SpinnerService } from '../universal/spinner/spinner.service';
import 'rxjs/add/operator/delay';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {TEST_DETAIL_CONFIG} from '../universal/dynamic-form/config';

@Component({
  selector: 'dtester-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css'],
  providers: [TestDetailService]
})
export class TestDetailComponent implements OnInit {
  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = TEST_DETAIL_CONFIG;
  testDetails: TestDetail[];
  headers: string[];
  /* array of headers */
  ignoreProperties: string[];
  countRecords: number;
  curenntTestId: number;
  COUNT_OF_TASKS: string = 'Необхідна кількість завданнь: ';
  countOfTasks: number;
  COUNT_OF_RATE: string = 'Загальна кількість балів за тест: ';
  countOfRate: number;
  MAIN_HEADER: string = 'Деталі тесту ';
  testName: string;
  CREATE_NEW_DETAIL: string;

  constructor(private testDetailService: TestDetailService,
              private route: ActivatedRoute,
              private spinner: SpinnerService,
              private router: Router) {
    this.countOfTasks = 0;
    this.countOfRate = 0;
    this.CREATE_NEW_DETAIL = 'Додати нову деталь';
  }

  ngOnInit() {
    this.spinner.showSpinner()
    this.headers = TEST_DETAIL_HEADERS;
    this.ignoreProperties = IGNORE_PROPERTIES;

    this.curenntTestId = this.route.snapshot.queryParams['test_id'];
    this.testName = this.route.snapshot.queryParams['test_name'];
    if (this.curenntTestId) {
      this.testDetailService.getTestDetails(this.curenntTestId).delay(300)
        .subscribe(res => {
          if (res['response'] === 'no records') {
            this.testDetails = [];
            this.spinner.hideSpinner();
          } else {
            this.testDetails = res;
            this.getCountOfTestDetails();
            this.spinner.hideSpinner();
          }
        });

    }
  }

  uploadPage() {
    this.spinner.showSpinner();
    this.testDetailService.getTestDetails(this.curenntTestId)
      .subscribe(res => {
        this.testDetails = <TestDetail[]>res, this.spinner.hideSpinner(); },
          err => this.router.navigate(['/bad_request']));
    }

  getCountOfTestDetails() {
    for (let testDetail of this.testDetails) {
      this.countOfTasks = this.countOfTasks + +testDetail.tasks;
      this.countOfRate = this.countOfRate + (+testDetail.tasks * +testDetail.rate);
    }
  }

  getTestDetails() {
    this.testDetailService.getTestDetails(this.curenntTestId)
      .subscribe(res => this.testDetails = res);
  }

  createTestDetail() {
    this.testDetailService.createTestDetail(+this.curenntTestId, 5, 1, 1).subscribe(() => this.getTestDetails());
  }


// Method for opening editing and deleting commo modal window

add(testDetail: TestDetail) {
  this.popup.sendItem(new TestDetail('', '', '', '', ''));
  this.popup.showModal();
}

edit(testDetail: TestDetail) {
  this.popup.sendItem(testDetail);
  this.popup.showModal();
}

del(testDetail: TestDetail) {
  this.popup.deleteEntity(testDetail);
}
// Method for  add/edit, delete form submiting

formSubmitted(testDetail: TestDetail) {
  console.log(testDetail);
  if (testDetail['id']) {
    this.testDetailService.editTestDetail(testDetail['id'], this.curenntTestId, testDetail['level'], testDetail['tasks'], testDetail['rate'])
      .subscribe(response => {
          this.uploadPage();
          this.popup.cancel();
        },
        error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': testDetail['level']}, relativeTo: this.route.parent})
      );
  } else {
    this.testDetailService.createTestDetail(this.curenntTestId, testDetail['level'], testDetail['tasks'], testDetail['rate'])
      .subscribe(response => {
          this.uploadPage();
          this.popup.cancel();
        },
        error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': testDetail['level']}, relativeTo: this.route.parent})
      );
  }
}

submitDelete(testDetail: TestDetail) {
    console.log(testDetail);
  this.testDetailService.deleteDetail(testDetail['id']).subscribe(response => this.uploadPage());
 }
}

