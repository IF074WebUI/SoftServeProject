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
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {
  HEADING_ANSWERS = 'Відповіді';
  title = 'Відповіді';
  answersOnPage: Answer[];
  pageNumber = 1;
  recordsPerPage = 5;
  countRecords: number;
  headers: string[];
  ignoreProperties: string[];
  question_id: number;
  questionIdQueryParam: number;
  imageForm: FormGroup;
  questionNameQueryParam: string;
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
    this.headers = ['№', 'Правильність', 'Відповідь', 'Вкладення'];
    this.ignoreProperties = ['question_id', 'answer_id'];
    this.imageForm = new FormGroup({});
  }
  getQueryParams() {
    this.route.queryParams.subscribe((params: Params) => {
      this.questionIdQueryParam = params['question_id'];
      this.questionNameQueryParam = params['question_text'];
      if (this.questionIdQueryParam) {
        this.getAnswersForOneQuestion();
      } else {
        this.getAnswers();
      }
    });
  }
  getAnswersForOneQuestion() {
    this.spinner.showSpinner();
    this.answersService.getAnswersByQuestion(this.questionIdQueryParam).subscribe(resp => {
      this.answersOnPage = resp;
      this.countRecords = 0;
      for (const answer of this.answersOnPage) {
        this.setNameOfQuestion(answer);
      }
      this.spinner.hideSpinner();
    });
  }
  setNameOfQuestion(answer: Answer) {
    this.getRecordsByIdService.getRecordsById('question', answer.question_id).subscribe((resp) => {
      answer.question_id = resp[0].question_id;
    });
  }

  getAnswers(): void {
    this.spinner.showSpinner();
    this.getCountRecords();
    if (this.countRecords <= (this.pageNumber - 1) * this.recordsPerPage) {
      --this.pageNumber;
    }
    this.answersService.getPaginatedPage(this.pageNumber, this.recordsPerPage).delay(301)
      .subscribe(resp => { this.answersOnPage = <Answer[]>resp, error => this.router.navigate(['/bad_request']);
        this.spinner.hideSpinner();
      });
  }

  getCountRecords() {
    this.answersService.getCountAnswers()
      .subscribe(resp => this.countRecords = resp );
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.getAnswersForOneQuestion();
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.recordsPerPage = numberOfRecords;
    this.pageNumber = 1;
    this.getAnswersForOneQuestion();
  }

  startSearch(criteria: string) {
    this.spinner.showSpinner();
    if (criteria === '' || +criteria <= 0 ) {
      this.getAnswersForOneQuestion();
    } else {
      this.answersService.searchByName(criteria)
        .subscribe(resp => {
            if (resp['response'] === 'no records') {
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
          error => this.router.navigate(['/bad_request']));
    }
  }

  add() {
    this.popup.sendItem({answer_id: '', question_id:  '', true_answer: '', answer_text: ''}, 'Answer');
    this.popup.showModal();
  }

  edit(answer: Answer) {
    this.popup.sendItem({answer_id: answer.answer_id, question_id: answer.question_id, true_answer: answer.true_answer, answer_text: answer.answer_text}, 'Answer', null, answer.attachment);
    this.popup.showModal();
  }

  del(answer: Answer) {
    this.popup.deleteEntity(answer);
  }

  formSubmitted(value) {
    value['question_id'] = this.question_id;
    if (value['answer_id']) {
      this.answersService.editAnswer(value['answer_id'], value['question_id'], value['answer_text'],
        value['true_answer'], value['photo'])
        .subscribe(resp => {
            this.getAnswersForOneQuestion();
            this.popup.cancel();
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': +value['question_text']},
            relativeTo: this.route.parent})
        );
    } else {
      console.log(value['question_id']);
      this.answersService.createAnswer(this.questionIdQueryParam, value['answer_text'],
        value['true_answer'], value['photo'])
        .subscribe(resp => {
            this.getAnswersForOneQuestion();
            this.popup.cancel();
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['question_text']},
            relativeTo: this.route.parent})
        );
    }
  }

  deleteAnswer(answer: Answer) {
    this.answersService.deleteAnswer(answer['answer_id']).subscribe(resp => this.getAnswers(),
      error => this.router.navigate(['/bad_request'])
    );
  }
}
