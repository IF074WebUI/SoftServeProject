import {Component, OnInit, ViewChild} from '@angular/core';
import {Question} from './question';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {QUESTION_CONFIG} from '../universal/dynamic-form/config';
import {QuestionsService} from '../services/questions.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';
import {GetRecordsByIdService} from "../services/get-records-by-id.service";

@Component({
  selector: 'dtester-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  HEADING_QUESTIONS = 'Питання';
  questionsOnPage: Question[];
  pageNumber = 1;
  recordsPerPage = 10;
  countRecords: number;
  headers: string[];
  ignoreProperties: string[];
  btnClass = 'fa fa-question';
  test_id: number;
  testIdQueryParam: number;
  limit: number;
  offset: number;

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = QUESTION_CONFIG;

  constructor(private questionsService: QuestionsService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: SpinnerService,
              private toastr: ToastsManager,
              private getRecordsByIdService: GetRecordsByIdService) {
  }

  ngOnInit() {
    this.headers = ['№', 'Питання', 'Рівень', 'Тип', 'Вкладення'];
    this.ignoreProperties = ['test_id', 'question_id'];
    this.test_id = this.route.snapshot.queryParams['test_id'];
    const level = this.route.snapshot.queryParams['level'];
    const number = this.route.snapshot.queryParams['number'];

    if (this.test_id) {
      this.getQuestionsByTest();
    } else if (level) {
      this.questionsService.getQuestionsByLevelRand(this.test_id, level, number).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.questionsOnPage = [];
        } else {
          this.questionsOnPage = resp;
        }
      });
    }
    else {
      this.getQuestions();
    }
  }

  getQuestionsByTest() {
    this.questionsService.getRecordsRangeByTest(this.test_id, this.recordsPerPage,
      (this.pageNumber - 1) * this.recordsPerPage).subscribe(resp => {
      if (resp['response'] === 'no records') {
        this.questionsOnPage = [], error => this.router.navigate(['/bad_request']);
      } else {
        this.questionsOnPage = resp, error => this.router.navigate(['/bad_request']);
      }
    });
  }
  getQuestions(): void {
    this.spinner.showSpinner();
    this.getCountRecords();
    if (this.countRecords <= (this.pageNumber - 1) * this.recordsPerPage) {
      --this.pageNumber;
    }
    this.questionsService.getPaginatedPage(this.pageNumber, this.recordsPerPage).delay(301)
      .subscribe(resp => { this.questionsOnPage = <Question[]>resp,
        error => this.router.navigate(['/bad_request']);
        this.spinner.hideSpinner();
      });
  }

  getCountRecords() {
    this.questionsService.getCountQuestions()
      .subscribe(resp => this.countRecords = resp );
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.getQuestionsByTest();
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.recordsPerPage = numberOfRecords;
    this.pageNumber = 1;
    this.getQuestionsByTest();
  }

  startSearch(criteria: string) {
    this.spinner.showSpinner();
    if (criteria === '' || +criteria <= 0 ) {
      this.getQuestions();
    } else {
      this.questionsService.searchByName(criteria)
        .subscribe(resp => {
            if (resp['response'] === 'no records') {
              this.questionsOnPage = [];
              this.countRecords = this.questionsOnPage.length;
              this.spinner.hideSpinner();
            } else {
              this.countRecords = 0;
              this.pageNumber = 2;
              this.questionsOnPage = resp;
              this.spinner.hideSpinner();
            }
          },
          error => this.router.navigate(['/bad_request']));
    }
  }

  add() {
    this.popup.sendItem({question_id: '', test_id:  this.test_id, question_text: '', level: '', type: ''}, 'Question');
    this.popup.showModal();
  }

  edit(question: Question) {
    this.popup.sendItem({question_id: question.question_id, test_id:  this.test_id, question_text: question.question_text, level: question.level, type: question.type}, 'Question', null, question.attachment);
    this.popup.showModal();
  }

  del(question: Question) {
    this.popup.deleteEntity(question);
  }

  formSubmitted(value) {
    value['test_id'] = this.test_id;
    if (value['question_id']) {
      this.questionsService.editQuestion(value['question_id'], value['question_text'],
        value['test_id'], value['level'], value['type'], value['photo'])
        .subscribe(resp => {
            this.getQuestionsByTest();
            this.popup.cancel();
            this.toastr.success('Edited');
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': +value['test_name']}, relativeTo: this.route.parent})
        );
    } else {
      this.questionsService.createQuestion(value['question_text'], value['test_id'], value['level'],
        value['type'], value['photo'])
        .subscribe(resp => {
            this.getQuestionsByTest();
            this.popup.cancel();
            this.toastr.success('Created');
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['test_name']}, relativeTo: this.route.parent})
        );
    }
  }

  deleteQuestion(question: Question) {
    this.questionsService.deleteQuestion(question['question_id']).subscribe(resp => {
      this.getQuestionsByTest();
    this.toastr.success('Deleted');
    },
      error => this.router.navigate(['/bad_request'])
    );
  }
  goToAnswers(question: Question) {
    this.router.navigate(['subject/tests/questions/answers'],
      {queryParams: {'question_id': question.question_id}, relativeTo: this.route.parent});
  }
}
