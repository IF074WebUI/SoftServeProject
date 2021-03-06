import {Component, OnInit, ViewChild} from '@angular/core';
import { TestDetailService } from './test-detail.service';
import { TestDetail } from './testDetail';
import { TEST_DETAIL_HEADERS, IGNORE_PROPERTIES } from './testDetailConsntants';
import {ActivatedRoute, Router} from '@angular/router';
import { SpinnerService } from '../universal/spinner/spinner.service';
import 'rxjs/add/operator/delay';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {TEST_DETAIL_CONFIG} from '../universal/dynamic-form/config';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'dtester-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.scss'],
  providers: [TestDetailService]
})
export class TestDetailComponent implements OnInit {
  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = TEST_DETAIL_CONFIG;
  testDetails: TestDetail[];
  headers: string[];
  ignoreProperties: string[];
  countRecords: number;
  curenntTestId: number;
  COUNT_OF_TASKS: string;
  countOfTasks: number;
  COUNT_OF_RATE: string;
  countOfRate: number;
  MAIN_HEADER: string;
  testName: string;
  CREATE_NEW_DETAIL: string;
  DISPLAY_PROPERTIES_ORDER: string[] = ['level', 'tasks', 'rate'];
  SORT_PROPERTIES: string[] = ['level'];
  displayPropertiesOrder: string[];
  sortProperties: string[];

  constructor(private testDetailService: TestDetailService,
              private route: ActivatedRoute,
              private toastr: ToastsManager,
              private spinner: SpinnerService,
              private router: Router) {
    this.CREATE_NEW_DETAIL = 'Додати нову деталь';
    this.MAIN_HEADER = 'Деталі тесту ';
    this.COUNT_OF_RATE =  'Загальна кількість балів за тест: ';
    this.COUNT_OF_TASKS = 'Необхідна кількість завданнь: ';
  }

  ngOnInit() {
    this.sortProperties = this.SORT_PROPERTIES;
    this.displayPropertiesOrder = this.DISPLAY_PROPERTIES_ORDER;
    this.spinner.showSpinner();
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
        }, error => this.toastr.error(error));
    }
  }

  uploadPage() {
    this.spinner.showSpinner();
    this.testDetailService.getTestDetails(this.curenntTestId)
      .subscribe(res => {
        this.testDetails = <TestDetail[]>res, this.getCountOfTestDetails(), this.spinner.hideSpinner(); },
        error => this.toastr.error(error));

  }

  getCountOfTestDetails() {
    this.countOfTasks = 0;
    this.countOfRate = 0;
    for (let testDetail of this.testDetails) {
      this.countOfTasks = this.countOfTasks + +testDetail.tasks;
      this.countOfRate = this.countOfRate + (+testDetail.tasks * +testDetail.rate);
    }
  }
  // Method for opening editing and deleting common modal window
  add(testDetail: TestDetail) {
    this.configs[2]['test_id'] = this.curenntTestId;
    this.popup.sendItem(new TestDetail('', '', '', '', ''), '', this.curenntTestId);
    this.popup.showModal();
  }
  edit(testDetail: TestDetail) {
    this.configs[2]['test_id'] = this.curenntTestId;
    this.popup.sendItem(testDetail);
    this.popup.showModal();
  }
  del(testDetail: TestDetail) {
    this.popup.deleteEntity(testDetail);
  }
  // Method for  add/edit, delete form submiting
  formSubmitted(testDetail: TestDetail) {
    if (testDetail['id']) {
      this.testDetailService.editTestDetail(
        testDetail['id'],
        this.curenntTestId,
        testDetail['level'],
        testDetail['tasks'],
        testDetail['rate'])
        .subscribe(response => {
            this.uploadPage();
            this.popup.cancel();
            this.toastr.success(`Деталь успішно відредагована`);
          },
          error => this.toastr.error(error)
        );
    } else {
      this.testDetailService.createTestDetail(
        this.curenntTestId,
        testDetail['level'],
        testDetail['tasks'],
        testDetail['rate'])
        .subscribe(response => {
            this.uploadPage();
            this.popup.cancel();
            this.toastr.success(`Деталь успішно додана`);
          },
          error => this.toastr.error(error)
        );
    }
  }
  submitDelete(testDetail: TestDetail) {
    this.testDetailService.deleteDetail(testDetail['id'])
      .subscribe(response => { this.uploadPage(); this.toastr.success(`Деталь успішно видалена`); });
   }
}

