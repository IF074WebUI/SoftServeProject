import { Component, OnInit } from '@angular/core';
import { TestDetailService } from './test-detail.service';
import { TestDetail } from './testDetail';
import { TEST_DETAIL_HEADERS, IGNORE_PROPERTIES } from './testDetailConsntants';

@Component({
  selector: 'dtester-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css'],
  providers: [TestDetailService]
})
export class TestDetailComponent implements OnInit {
  testDetails: TestDetail[];
  testId: number = 1;
  headers: string[];            /* array of headers */
  ignoreProperties: string[];
  pageNumber: number = 1;
  offset = 5;   /*number of the records for the stating page*/
  countRecords: number;

  constructor(private testDetailService: TestDetailService) { }
  ngOnInit() {
    this.headers = TEST_DETAIL_HEADERS;
    this.ignoreProperties = IGNORE_PROPERTIES;

  }
  showDetails() {
    this.testDetailService.getTestDetails(this.testId)
      .subscribe(res => this.testDetails = res);
  }

}
