import {Component, OnInit} from '@angular/core';
import {ResultsService} from '../services/results.service';
import {Result} from './result';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {StudentsService} from '../students/students.service';
import {Student} from '../students/student';
import {TestsService} from '../services/tests.service';
import {Group} from '../group/group';
import {GroupService} from '../group/group.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QueryParamsHandling} from "@angular/router/src/config";
import {SpinnerService} from "../universal/spinner/spinner.service";

@Component({
  selector: 'dtester-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  RESULTS_HEADERS: string[] = ['№', 'студент', 'тест', 'група', 'дата', 'результат'];
  IGNORE_PROPERTIES: string[] = ['session_id', 'true_answers', 'start_time', 'end_time', 'answers', 'questions', 'student_id'];
  DISPLAY_ORDER: string[] = ['student_name', 'test_name', 'group_name', 'session_date', 'result'];

  results: Result[];
  groups: Group[];
  tests: {test_id: number, test_name: string, subject_id: number, tasks: number, time_for_test: string, enabled: number, attempts: number}[];
  count: number;
  countPerPage: number = 10;
  page: number = 1;

  searchByGroupTestForm: FormGroup;
  groupControl: FormControl;
  testControl: FormControl;
  dateControl: FormControl;

  constructor(private resultsService: ResultsService, private router: Router, private activatedRoute: ActivatedRoute,
              private toastr: ToastsManager, private studentsService: StudentsService, private groupsService: GroupService,
              private testsService: TestsService, private spinnerService: SpinnerService) {
    this.groupControl = new FormControl('', Validators.required);
    this.testControl = new FormControl('', Validators.required);
    this.dateControl = new FormControl('');
    this.searchByGroupTestForm = new FormGroup({
      'group': this.groupControl,
      'test': this.testControl,
      'date': this.dateControl
    });
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.activatedRoute.queryParams.subscribe(params => {
        let studentId = params['student'];
        let testId = params['test'];
        let groupId = params['group'];
        let date = params['date'];
        if (studentId) {
          this.resultsService.getAllByStudent(studentId).subscribe((resp: Result[]) => {
            this.results = resp;
            this.count = this.results.length;
            this.transformResults();
          }, err => this.router.navigate(['/bad_request']));
        } else if (testId && groupId) {
          this.resultsService.getAllByTestGroupDate(testId, groupId, date).subscribe((resp: Result[]) => {
            this.results = resp;
            this.count = this.results.length;
            this.transformResults();
          }, err => this.router.navigate(['/bad_request']));
        } else {
          this.getResults();
          this.getCount();
        }
      }
    );
    this.groupsService.getGroups().subscribe((resp: Group[]) => this.groups = resp);
    this.testsService.getAll().subscribe((resp: any) => this.tests = resp);
  }

  transformResults(): void {
    if (!Array.isArray(this.results)) {
      this.results = [];
      this.count = 0;
      this.spinnerService.hideSpinner();
      return;
    }
    this.results.map((result: Result) => {
      this.studentsService.getStudentById(result.student_id)
        .subscribe((resp: Student) => {
          this.groupsService.getGroupById(resp.group_id).subscribe((group: Group) =>
          result['group_name'] = group[0]['group_name']);
          result['student_name'] = resp[0]['student_name'] + ' ' + resp[0]['student_surname'];
          this.spinnerService.hideSpinner();
        });
      this.testsService.getTestById(result.test_id)
        .subscribe((resp: any) => {
          result['test_name'] = resp[0]['test_name'];
        });

    });

  }

  getResults(): void {
    this.spinnerService.showSpinner();
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.resultsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe((resp: Result[]) => {
        this.results = resp;
        this.transformResults();
        this.spinnerService.hideSpinner();
      }, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.resultsService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  findByGroupTest(): void {
    let qp = this.dateControl.value !== '' ?
      {test: this.testControl.value, group: this.groupControl.value, date: this.dateControl.value} :
      {test: this.testControl.value, group: this.groupControl.value};
    this.router.navigate(['./results'], {queryParams: qp, relativeTo: this.activatedRoute.parent});
  }

  findByStudent(result: Result): void {
    this.router.navigate(['./results'], {queryParams: {student: result.student_id}, relativeTo: this.activatedRoute.parent});
  }

  detailedByStudent(result: Result) {
    this.router.navigate(['./results', result.student_id], {relativeTo: this.activatedRoute.parent});
  }

  changePage(page: number) {
    this.page = page;
    this.getResults();
  }

  changeCountPerPage(itemsPerPage: number) {    /* callback method to set count entities per page when dropdown item had been selected */
    this.countPerPage = itemsPerPage;
    this.getResults();
  }

  del(result: Result) {
    this.spinnerService.showSpinner();
    this.resultsService.delete(result.session_id).subscribe(resp => {
        --this.count;
        this.getResults();
        this.spinnerService.hideSpinner();
        this.toastr.success(`Результат успішно видалений`);
      },
      err => this.router.navigate(['/bad_request']));
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Результати тестування</title>
          <style>
          @media print {  
            .hidden-print   { display: none !important; }
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
