import {Component, OnInit, ViewChild} from '@angular/core';
import { ResultsService } from '../services/results.service';
import { Result } from './result';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { StudentsService } from '../students/students.service';
import { Student } from '../students/student';
import { TestsService } from '../services/tests.service';
import { Group } from '../group/group';
import { GroupService } from '../group/group.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../universal/spinner/spinner.service';
import { TestDetailService } from '../test-detail/test-detail.service';
import { Test } from '../tests/test';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'dtester-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  readonly RESULTS_HEADERS: string[] = ['№', 'студент', 'тест', 'група', 'дата', '%', 'результат'];
  readonly IGNORE_PROPERTIES: string[] = ['session_id', 'true_answers', 'start_time', 'end_time', 'answers', 'questions', 'student_id'];
  readonly SORT_PROPERTIES: string[] = ['student_name', 'percentage'];
  readonly DISPLAY_ORDER: string[] = ['student_name', 'test_name', 'group_name', 'session_date', 'percentage', 'result'];

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;

  results: Result[];
  groups: Group[];
  sortProperties: string[];
  tests: Test[];
  count: number;
  countPerPage = 10;
  page = 1;

  searchByGroupTestForm: FormGroup;
  groupControl: FormControl;
  testControl: FormControl;
  dateControl: FormControl;

  constructor(private resultsService: ResultsService, private router: Router, private activatedRoute: ActivatedRoute,
              private toastr: ToastsManager, private studentsService: StudentsService,
              private groupsService: GroupService, private testsService: TestsService,
              private spinnerService: SpinnerService, private testDetailsService: TestDetailService) {
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
    this.sortProperties = this.SORT_PROPERTIES;
    this.activatedRoute.queryParams.subscribe(params => {
        const studentId = params['student'];
        const testId = params['test'];
        const groupId = params['group'];
        const date = params['date'];
        if (studentId) {
          this.resultsService.getAllByStudent(studentId).subscribe((resp: Result[]) => {
            this.results = resp;
            this.count = this.results.length;
            this.transformResults();
          });
        } else if (testId && groupId) {
          this.resultsService.getAllByTestGroupDate(testId, groupId, date).subscribe((resp: Result[]) => {
            this.results = resp;
            this.count = this.results.length;
            this.transformResults();
          });
        } else {
          this.getResults();
          this.getCount();
        }
      }
    );
    this.groupsService.getGroups().subscribe((resp: Group[]) => this.groups = resp);
    this.testsService.getAll().subscribe((resp: Test[]) => this.tests = resp);
  }

  transformResults() {
    if (!Array.isArray(this.results)) {
      this.results = [];
      this.count = 0;
      this.spinnerService.hideSpinner();
      return;
    }
    this.results.map((result: Result, i: number) => {
         this.studentsService.getStudentById(result.student_id)
        .subscribe((resp: Student) => {
          result['student_name'] = resp[0]['student_surname'] + ' ' + resp[0]['student_name'];
          Observable.forkJoin(this.groupsService.getGroupById(resp[0].group_id),
            this.testsService.getTestById(result.test_id), this.testDetailsService.getTestDetails(result.test_id)).subscribe(r => {
            result['group_name'] = r[0][0]['group_name'];
            result['test_name'] = r[1][0]['test_name'];
            let sum = 0;
            for (const tDetail of r[2]) {
              sum += +tDetail.rate * tDetail.tasks;
            }
            result['percentage'] = (result.result * 100 / sum).toFixed(2);
            if (i === this.results.length - 1) {
              this.spinnerService.hideSpinner();
            }
          });
        });
    });
  }

  getResults(): void {
    this.spinnerService.showSpinner();
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.resultsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe((resp: Result[]) => {
        this.results = resp;
        this.transformResults();
      });
  }

  getCount(): void {
    this.resultsService.getCount().subscribe(resp => this.count = resp);
  }

  findByGroupTest(): void {
    const qp = this.dateControl.value !== '' ?
    {test: this.testControl.value, group: this.groupControl.value, date: this.dateControl.value} :
    {test: this.testControl.value, group: this.groupControl.value};
    this.spinnerService.showSpinner();
    this.router.navigate(['./results'], {queryParams: qp, relativeTo: this.activatedRoute.parent});
  }

  findByStudent(result: Result): void {
    this.router.navigate(['./results'], {
      queryParams: {student: result.student_id},
      relativeTo: this.activatedRoute.parent
    });
  }

  detailedByStudent(result: Result) {
    this.router.navigate(['./results', result.student_id], {relativeTo: this.activatedRoute.parent});
  }

  changePage(page: number) {
    this.page = page;
    this.getResults();
  }

  changeCountPerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getResults();
  }

  del(result: Result) {
    this.popup.deleteEntity(result);
  }

  submitDelete(result: Result) {
    this.spinnerService.showSpinner();
    this.resultsService.delete(result.session_id).subscribe(resp => {
        --this.count;
        this.getResults();
        this.spinnerService.hideSpinner();
        this.toastr.success(`Результат успішно видалений`);
      });
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
          <link rel="stylesheet" type="text/css" href="/assets/bootstrap.min.css" media="print">           
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
