import {Component, OnInit, ViewChild} from '@angular/core';
import {Answer} from './answer';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AnswersService} from '../services/answers.service';
import {ANSWER_CONFIG} from '../universal/dynamic-form/config';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {GetRecordsByIdService} from '../services/get-records-by-id.service';
import {FormGroup} from '@angular/forms';
import {Question} from "../questions/question";


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
  CREATING_NEW_ANSWER = 'Додати нову відповідь';
  question_id: number;
  questionIdQueryParam: number;
  imageForm: FormGroup;
  questionNameQueryParam: string;
  answerEdit: Answer;
  sortProperties: string[];

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
    this.headers = ['№', 'Правильність', 'Відповідь', 'Вкладення'];
    this.ignoreProperties = ['question_id', 'answer_id'];
    this.imageForm = new FormGroup({});
  }
  getQueryParams() {
    this.route.queryParams.subscribe((params: Params) => {
      this.questionIdQueryParam = params['question_id'];
      this.questionNameQueryParam = params['question_text'];
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
     // answer.question_text = resp[0].question_text;
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
    this.getAnswersForOneQuestion();               /* request new groups for new page */
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.recordsPerPage = numberOfRecords;
    this.pageNumber = 1;
    this.getAnswersForOneQuestion();
  }

  startSearch(criteria: string) {   /* callback method for output in search component */
    this.spinner.showSpinner();
    if (criteria === '' || +criteria <= 0 ) {
      this.getAnswersForOneQuestion();
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
    this.popup.sendItem({'answer_id': '', 'question_id': this.questionIdQueryParam, 'answer_text': '', 'true_answer': ''}, 'answer');
    this.popup.showModal();
  }

  edit(answer: Answer) {
    this.popup.sendItem({'answer_id': answer.answer_id, 'question_id': this.questionIdQueryParam, 'answer_text': answer.answer_text, 'true_answer': answer.true_answer}, 'answer',  null, answer.attachment);
    this.popup.showModal();
  }

  del(answer: Answer) {
    this.popup.deleteEntity(answer);
  }
  // Method for  add/edit, delete form submiting

  formSubmitted(value) {
    value['question_id'] = this.questionIdQueryParam;
    console.log(value);
    if (value['answer_id']) {
      this.answersService.editAnswer(value['answer_id'], value['question_id'], value['answer_text'],
        value['true_answer'], value['photo'])
        .subscribe(response => {
            this.getAnswersForOneQuestion();
            this.popup.cancel();
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': +value['question_text']},
            relativeTo: this.route.parent})
        );
    } else {
      this.answersService.createAnswer(value['question_id'], value['answer_text'],
        value['true_answer'], value['photo'])
        .subscribe(response => {
            this.getAnswersForOneQuestion();
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
