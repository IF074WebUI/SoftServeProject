import { Component, OnInit } from '@angular/core';
import { TestDetailService } from './test-detail.service';
import { TestDetail } from './testDetail';
import { TEST_DETAIL_HEADERS, IGNORE_PROPERTIES } from './testDetailConsntants';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../universal/spinner/spinner.service';
import 'rxjs/add/operator/delay';


@Component({
  selector: 'dtester-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css'],
  providers: [TestDetailService]
})
export class TestDetailComponent implements OnInit {
  testDetails: TestDetail[];
  testId: number = 2;
  headers: string[];            /* array of headers */
  ignoreProperties: string[];
  countRecords: number;
  curenntTestId: number;

  COUNT_OF_TASKS: string = 'Необхідна кількість завданнь: ';
  countOfTasks: number = 0;
  MAIN_HEADER: string = 'Деталі тесту ';
  testName: string;

  constructor(private testDetailService: TestDetailService,
              private route: ActivatedRoute,
              private spinner: SpinnerService) { }
  ngOnInit() {
    this.spinner.showSpinner()
    this.headers = TEST_DETAIL_HEADERS;
    this.ignoreProperties = IGNORE_PROPERTIES;

    let testId: number = this.route.snapshot.queryParams['test_id'];
    let testName: string = this.route.snapshot.queryParams['test_name'];
    this.testName = testName;
    this.curenntTestId = testId;
    if (testId) {
      this.testDetailService.getTestDetails(testId).delay(300)
        .subscribe(res => {
          if (res['response'] === 'no records') {
            this.testDetails = [];
            this.spinner.hideSpinner();
          } else {
            this.testDetails = res;
            for (let testDetail of this.testDetails) {
              this.countOfTasks = this.countOfTasks + +testDetail.tasks;
            }
            this.spinner.hideSpinner();
          }
        });

    }
  }
  getTestDetails() {
    this.testDetailService.getTestDetails(this.curenntTestId)
      .subscribe(res => this.testDetails = res);
  }

  createTestDetail() {
    this.testDetailService.createTestDetail(+this.curenntTestId, 5, 1, 1).subscribe(() => this.getTestDetails());
  }

}
