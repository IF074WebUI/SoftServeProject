import {Component, OnInit, ViewChild} from '@angular/core';
import {Answer} from './answer';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AnswersService} from '../services/answers.service';
import {ANSWER_CONFIG} from '../universal/dynamic-form/config';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {GetRecordsByIdService} from '../services/get-records-by-id.service';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'dtester-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {
  answersOnPage: Answer[];
  pageNumber = 1;
  recordsPerPage = 10;
  countRecords: number;
  headers: string[];
  ignoreProperties: string[];
  btnClass = 'fa fa-question';
  CREATING_NEW_ANSWER = 'Додати нову відповідь';
  question_id: number;
  questionIdQueryParam: number;
  imageForm: FormGroup;
  answerEdit: Answer;

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = ANSWER_CONFIG;

  constructor(private answersService: AnswersService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: SpinnerService,
              private getRecordsByIdService: GetRecordsByIdService
  ) {}

  ngOnInit() {
    this.getQueryParams();
    // this.getAnswers();
    this.headers = ['№', 'Відповідь', 'Правильність', 'Вкладення'];
    this.ignoreProperties = ['question_id', 'answer_id'];
    this.imageForm = new FormGroup({});
  }
  getQueryParams() {
    this.route.queryParams.subscribe((params: Params) => {
      this.questionIdQueryParam = params['question_id'];
      if (this.questionIdQueryParam) this.getAnswersForOneQuestion();
      else
      this.getAnswers();
    });
  }
  getAnswersForOneQuestion() {
    this.answersService.getAnswersByQuestion(this.questionIdQueryParam).subscribe(resp => {
      this.answersOnPage = resp;
      this.countRecords = 0;
      for (const answer of this.answersOnPage) {
        this.setNameOfQuestion(answer);
      }
    });
  }
  setNameOfQuestion(answer: Answer) {
    this.getRecordsByIdService.getRecordsById('question', answer.question_id).subscribe((resp) => {
      answer.question_id = resp[0].question_id;
    });
  }
  // PARAMS

  getAnswers(): void {
    this.spinner.showSpinner();
    this.getCountRecords();
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.countRecords <= (this.pageNumber - 1) * this.recordsPerPage) {
      --this.pageNumber;
    }
    this.answersService.getPaginatedPage(this.pageNumber, this.recordsPerPage).delay(301)
      .subscribe(resp => { this.answersOnPage = <Answer[]>resp, err => this.router.navigate(['/bad_request']);
        this.spinner.hideSpinner();
      });
  }

  getCountRecords() {
    this.answersService.getCountAnswers()
      .subscribe(resp => this.countRecords = resp );
  }

  changePage(page: number) {              /* callback method for change page pagination output event */
    this.pageNumber = page;
    this.getAnswers();               /* request new groups for new page */
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.recordsPerPage = numberOfRecords;
    this.pageNumber = 1;
    this.getAnswers();
  }

  startSearch(criteria: string) {   /* callback method for output in search component */
    this.spinner.showSpinner();
    if (criteria === '' || +criteria <= 0 ) {
      this.getAnswers();
    } else {
      this.answersService.searchByName(criteria)
        .subscribe(resp => {
            if (resp['response'] === 'no records') {    /* check condition: if no records presented for search criteria */
              this.answersOnPage = [];
              this.countRecords = this.answersOnPage.length;
              this.spinner.hideSpinner();
            } else {
              this.countRecords = 0;
              this.pageNumber = 2;
              this.answersOnPage = resp;
              this.spinner.hideSpinner();
            }
          },
          err => this.router.navigate(['/bad_request']));
    }
  }

// Method for opening editing and deleting commo modal window

  add() {
    this.popup.sendItem(new Answer());
    this.popup.showModal();
  }

  edit(answer: Answer) {
    this.popup.sendItem(answer);
    this.popup.showModal();
  }

  del(answer: Answer) {
    this.popup.deleteEntity(answer);
  }
  // Method for  add/edit, delete form submiting

  formSubmitted(value) {
    value['question_id'] = this.question_id;
    console.log(value);
    if (value['answer_id']) {
      this.answersService.editAnswer(value['answer_id'], value['answer_text'], value['question_id'],
        value['true_answer'], value['attachment'])
        .subscribe(response => {
            this.getAnswers();
            this.popup.cancel();
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': +value['question_text']},
            relativeTo: this.route.parent})
        );
    } else {
      this.answersService.createAnswer(value['answer_text'], value['question_id'],
        value['true_answer'], value['attachment'])
        .subscribe(response => {
            this.getAnswers();
            this.popup.cancel();
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['question_text']},
            relativeTo: this.route.parent})
        );
    }
  }

  deleteAnswer(answer: Answer) {
    this.answersService.deleteAnswer(answer['answer_id']).subscribe(response => this.getAnswers(),
      error => this.router.navigate(['/bad_request'])
    );
  }
}
