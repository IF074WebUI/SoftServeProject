import {Component, OnInit, ViewChild} from '@angular/core';
import {Question} from "./question";
import {DynamicFormComponent} from "../universal/dynamic-form/container/dynamic-form/dynamic-form.component";
import {QUESTION_CONFIG} from "../universal/dynamic-form/config";
import {QuestionsService} from "../services/questions.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SpinnerService} from "../universal/spinner/spinner.service";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questionsOnPage: Question[];
  pageNumber: number = 1;
  recordsPerPage = 10;
  countRecords: number;
  headers: string[];
  ignoreProperties: string[];
  btnClass: string = 'fa fa-question';
  CREATING_NEW_QUESTION = 'Додати нове питання';

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = QUESTION_CONFIG;

  constructor(private questionsService: QuestionsService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: SpinnerService
  ) {}

  ngOnInit() {
    this.headers = ['№', 'Питання', 'Рівень', 'Тип', 'Вкладення'];
    this.ignoreProperties = ['test_id', 'question_id', 'attachment'];

    this.getQuestions();

    // let facultyId = this.route.snapshot.queryParams['facultyId'];
    // console.log(facultyId);
    // if (facultyId) {
    //   this.getGroupsService.getGroupsByFaculty(facultyId).subscribe(resp => {
    //     if (resp['response'] === 'no records') {
    //       this.groupsOnPage = [];
    //     } else {
    //       this.groupsOnPage = resp;
    //     });
    // }

    let testId = this.route.snapshot.queryParams['testId'];
    if (testId) {
      this.questionsService.getQuestionsByTest(testId).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.questionsOnPage = [], error => this.router.navigate(['/bad_request']);
        } else {
          this.questionsOnPage = resp, error => this.router.navigate(['/bad_request']);
        }
      });
    }
  }

  getQuestions(): void {
    this.spinner.showSpinner();
    this.getCountRecords()
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.countRecords <= (this.pageNumber - 1) * this.recordsPerPage) {
      --this.pageNumber;
    }
    this.questionsService.getPaginatedPage(this.pageNumber, this.recordsPerPage).delay(301)
      .subscribe(resp => { this.questionsOnPage = <Question[]>resp, err => this.router.navigate(['/bad_request']);
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
  // get students by group
  getAnswersByQuestion(question: Question) {
    this.router.navigate(['./answers'], {queryParams: {'question_id': question.question_id}, relativeTo: this.route.parent});
    console.log(question);
  }
  // search group
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
  // onTimeTableNavigate(question: Question) {
  //   this.router.navigate(['./timetable'], {queryParams: {'group_id': group.group_id}, relativeTo: this.route.parent});
  // }


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
    console.log(value);
    if (value['question_id']) {
      this.questionsService.editQuestion(+value['question_id'], value['question_text'], value['Test'])
        .subscribe(response => {
            this.getQuestions();
            this.popup.cancel();
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['test_name']}, relativeTo: this.route.parent})
        );
    } else {
      this.questionsService.createQuestion(value['question_text'], value['Test'])
        .subscribe(response => {
            this.getQuestions();
            this.popup.cancel();
          },
          error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['test_name']}, relativeTo: this.route.parent})
        );
    }
  }

  submitDelete(question: Question) {
    this.questionsService.deleteQuestion(question['question_id']).subscribe(response => this.getQuestions(),
      error => this.router.navigate(['/bad_request'])
    );
  }

}
