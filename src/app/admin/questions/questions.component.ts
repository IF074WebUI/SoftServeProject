import {Component, OnInit, ViewChild} from '@angular/core';
import {Question} from './question';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {QUESTION_CONFIG} from '../universal/dynamic-form/config';
import {QuestionsService} from '../services/questions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'dtester-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questionsOnPage: Question[];
  pageNumber = 1;
  recordsPerPage = 10;
  countRecords: number;
  headers: string[];
  ignoreProperties: string[];
  btnClass = 'fa fa-question';
  imgAttach = 'question.attachment';
  CREATING_NEW_QUESTION = 'Додати нове питання';
  test_id: number;

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = QUESTION_CONFIG;

  constructor(private questionsService: QuestionsService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: SpinnerService,
              private toastr: ToastsManager
  ) {}

  ngOnInit() {
    this.headers = ['№', 'Питання', 'Рівень', 'Тип', 'Вкладення'];
    this.ignoreProperties = ['test_id', 'question_id', 'attachment'];
    // this.imageFormQ = new FormGroup({});
    this.getQuestions();
    this.test_id = this.route.snapshot.queryParams['test_id'];
    console.log(this.test_id);
    const level = this.route.snapshot.queryParams['level'];
    const number = this.route.snapshot.queryParams['number'];
    if (this.test_id) {
      this.questionsService.getRecordsRangeByTest(this.test_id, this.recordsPerPage,
        (this.pageNumber - 1) * this.recordsPerPage).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.questionsOnPage = [], error => this.router.navigate(['/bad_request']);
        } else {
          this.questionsOnPage = resp, error => this.router.navigate(['/bad_request']);
        }
      });
    } else if (level) {
      this.questionsService.getQuestionsByLevelRand(this.test_id, level, number).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.questionsOnPage = [];
        } else {
          this.questionsOnPage = resp;
        }
      });
    } else {
      this.getQuestions();
    }

  }
  getQuestions(): void {
    this.spinner.showSpinner();
    this.getCountRecords();
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.countRecords <= (this.pageNumber - 1) * this.recordsPerPage) {
      --this.pageNumber;
    }
    this.questionsService.getPaginatedPage(this.pageNumber, this.recordsPerPage).delay(301)
      .subscribe(resp => { this.questionsOnPage = <Question[]>resp,
        err => this.router.navigate(['/bad_request']);
        this.spinner.hideSpinner();
      });
  }

  getCountRecords() {
    this.questionsService.getCountQuestions()
      .subscribe(resp => this.countRecords = resp );
  }

  changePage(page: number) {              /* callback method for change page pagination output event */
    this.pageNumber = page;
    this.getQuestions();               /* request new groups for new page */
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.recordsPerPage = numberOfRecords;
    this.pageNumber = 1;
    this.getQuestions();
  }

  startSearch(criteria: string) {   /* callback method for output in search component */
    this.spinner.showSpinner();
    if (criteria === '' || +criteria <= 0 ) {
      this.getQuestions();
    } else {
      this.questionsService.searchByName(criteria)
        .subscribe(resp => {
            if (resp['response'] === 'no records') {    /* check condition: if no records presented for search criteria */
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
          err => this.router.navigate(['/bad_request']));
    }
  }

// Method for opening editing and deleting commo modal window

  add() {
    this.popup.sendItem(new Question());
    this.popup.showModal();
  }

  edit(question: Question) {
    this.popup.sendItem(question);
    this.popup.showModal();
  }

  del(question: Question) {
    this.popup.deleteEntity(question);
  }
  // Method for  add/edit, delete form submiting

  formSubmitted(value) {
    value['test_id'] = this.test_id;
    console.log(value);
    if (value['question_id']) {
      this.questionsService.editQuestion(value['question_id'], value['question_text'],
        value['test_id'], value['level'], value['type'], value['attachment'])
        .subscribe(response => {
            this.getQuestions();
            this.popup.cancel();
            this.toastr.success('Edited');
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': +value['test_name']}, relativeTo: this.route.parent})
        );
    } else {
      this.questionsService.createQuestion(value['question_text'], value['test_id'], value['level'],
        value['type'], value['attachment'])
        .subscribe(response => {
            this.getQuestions();
            this.popup.cancel();
            this.toastr.success('Created');
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['test_name']}, relativeTo: this.route.parent})
        );
    }
  }

  deleteQuestion(question: Question) {
    this.questionsService.deleteQuestion(question['question_id']).subscribe(response => {this.getQuestions();
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
