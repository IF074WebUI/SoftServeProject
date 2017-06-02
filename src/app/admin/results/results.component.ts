import {Component, OnInit} from '@angular/core';
import {ResultsService} from '../services/results.service';
import {Result} from './result';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {StudentsService} from '../students/students.service';
import {Student} from '../students/student';
import {TestsService} from '../services/tests.service';
import {Group} from "../group/group";
import {GroupService} from "../group/group.service";

@Component({
  selector: 'dtester-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  RESULTS_HEADERS: string[] = ['№', 'студент', 'тест', 'початок', 'закінчення', 'дата', 'результат'];
  IGNORE_PROPERTIES: string[] = ['session_id', 'true_answers', 'answers', 'questions', 'student_id', ];
  DISPLAY_ORDER: string[] = ['student_name', 'test_name', 'start_time', 'end_time', 'session_date', 'result'];

  results: Result[];
  groups: Group[];
  tests: {test_id: number, test_name: string, subject_id: number, tasks: number, time_for_test: string, enabled: number, attempts: number}[];
  testId: number;
  groupId: number;
  count: number;
  countPerPage: number = 10;
  page: number = 1;

  constructor(private resultsService: ResultsService, private router: Router, private activatedRoute: ActivatedRoute,
  private toastr: ToastsManager, private studentsService: StudentsService, private groupsService: GroupService,
              private testsService: TestsService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let studentId = params['student'];
      let testId = params['test'];
      let groupId = params['group'];
      let date = params['date'];
      if (studentId) {
        this.resultsService.getAllByStudent(studentId).subscribe((resp: Result[]) => {
          this.results = resp;
          this.transformResults();
        }, err => this.router.navigate(['/bad_request']));
      } else if (testId && groupId) {
        this.resultsService.getAllByTestGroupDate(testId, groupId, date).subscribe((resp: Result[]) => {
          this.results = resp;
          this.transformResults();
        }, err => this.router.navigate(['/bad_request']));
      } else if (groupId) {
        this.resultsService.getPassedTestsByGroup(groupId).subscribe((resp: Result[]) => {
          this.RESULTS_HEADERS = ['№', 'id тесту'];
          this.results = resp;
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
    this.results.map((result: Result) => { this.studentsService.getStudentById(result.student_id)
      .subscribe((resp: Student) => {
      result['student_name'] = resp[0]['student_name'] + ' ' + resp[0]['student_surname'];
    });
      this.testsService.getTestById(result.test_id)
        .subscribe((resp: any) => {
          result['test_name'] = resp[0]['test_name'];
        });
    });

  }

  getResults(): void {
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.resultsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe((resp: Result[]) => {
        resp.forEach((res: Result) => {
          res.questions = res.questions.replace(new RegExp('&quot;', 'g'), '');
        });
        this.results = resp;
        this.transformResults();
      }, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.resultsService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  setGroup(groupId: number) {
    this.groupId = groupId;
  }

  setTest(testId: number) {
    this.testId = testId;
  }

  findByGroupTest(): void {
    this.resultsService.getAllByTestGroupDate(this.testId, this.groupId).subscribe((resp: Result[]) => {this.results = resp;
      this.getCount();
      this.transformResults();
    });
  }

  findByStudent(result: Result): void {
    this.resultsService.getAllByStudent(result.student_id).subscribe((resp: Result[]) => {this.results = resp;
      this.getCount();
      this.transformResults();
    });
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
    this.resultsService.delete(result.session_id).subscribe(resp => {
        --this.count;
        this.getResults();
        this.toastr.success(`Результат успішно видалений`);
      },
      err => this.router.navigate(['/bad_request']));
  }

}
