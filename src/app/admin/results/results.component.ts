import {Component, OnInit} from '@angular/core';
import {ResultsService} from '../services/results.service';
import {Result} from './result';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'dtester-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  RESULTS_HEADERS: string[] = ['№', 'id студента', 'id тесту', 'дата', 'початок', 'закінчення', 'результат'];
  IGNORE_PROPERTIES: string[] = ['session_id', 'true_answers', 'answers', 'questions'];

  results: Result[];
  count: number;
  countPerPage: number = 5;
  page: number = 1;

  constructor(private resultsService: ResultsService, private router: Router, private activatedRoute: ActivatedRoute,
  private toastr: ToastsManager) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let studentId = params['student'];
      let testId = params['test'];
      let groupId = params['group'];
      let date = params['date'];
      if (studentId) {
        console.log(studentId);
        this.resultsService.getAllByStudent(studentId).subscribe((resp: Result[]) => {
          this.results = resp;
        }, err => this.router.navigate(['/bad_request']));
      } else if (testId && groupId) {
        this.resultsService.getAllByTestGroupDate(testId, groupId, date).subscribe((resp: Result[]) => {
          this.results = resp;
        }, err => this.router.navigate(['/bad_request']));
      } else if (groupId) {
        this.resultsService.getPassedTestsByGroup(groupId).subscribe((resp: Result[]) => {
          this.RESULTS_HEADERS = ['№', 'id тесту'];
          this.results = resp;
        }, err => this.router.navigate(['/bad_request']));
      } else {
        this.getResults();
        this.getCount();
      }
      }
    );
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
      }, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.resultsService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
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
