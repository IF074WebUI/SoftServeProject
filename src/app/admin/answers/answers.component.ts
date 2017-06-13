import {Component, OnInit, ViewChild} from '@angular/core';
import {Answer} from "./answer";
import {DynamicFormComponent} from "../universal/dynamic-form/container/dynamic-form/dynamic-form.component";
import {GetRecordsRangeService} from "../services/get-records-range.service";
import {GetRecordsBySearchService} from "../services/get-records-by-search.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AnswersService} from "../services/answers.service";
import {DeleteRecordByIdService} from "../services/delete-record-by-id.service";
import {StatisticsService} from "../statistics/statistics.service";
import {ANSWER_CONFIG} from "../universal/dynamic-form/config";


declare var $: any;

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {
  answers: Answer[] = [];
  headers: string[];
  displayPropertiesOrder: string[];
  numberOfRecords: number;
  recordsPerPage: number;
  page: number;
  btnClass: string = 'fa fa-calendar';
  imgAttach = 'answer.attachment';


  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = ANSWER_CONFIG;
  constructor(private statisticsService: StatisticsService,
              private getRecordsRangeService: GetRecordsRangeService,
              private getRecordsBySearchService: GetRecordsBySearchService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private answersService: AnswersService,
              private deleteRecordByIdService: DeleteRecordByIdService) { }

  ngOnInit() {
    this.page = 1;
    this.recordsPerPage = 5;
    this.getCountRecords();
    this.getAnswersRange();
    this.headers = ['№', 'відповіді', 'Вкладення', 'Правильна відповідь'];
    this.displayPropertiesOrder = ['answers_text', 'attachment', 'true_answer'];
  }
  getAnswersRange() {
    if (this.numberOfRecords <= (this.page - 1) * this.recordsPerPage) {
      --this.page;
    }
    this.getRecordsRangeService.getRecordsRange('question', this.recordsPerPage, (this.page - 1) * this.recordsPerPage)
      .subscribe((data) => {
        this.answers = data;
      });
  }
  getCountRecords() {
    this.statisticsService.getCountRecords('question').subscribe((data) => {
      this.numberOfRecords = data.numberOfRecords;
    });
  }
  changePage(page: number) {
    this.page = page;
    this.getAnswersRange();
  }
  changeNumberOfRecordsPerPage(newNumberOfRecordsPerPage: number) {
    this.recordsPerPage = newNumberOfRecordsPerPage;
    this.getAnswersRange();
  }
  startSearch(criteria: string) {
    if (criteria === '') {
      this.getAnswersRange();
      this.getCountRecords();
    } else {
      this.getRecordsBySearchService.getRecordsBySearch('answer', criteria).subscribe(resp => {
          if (resp['response'] === 'no records') {
            this.answers = [];
            this.numberOfRecords = this.answers.length;
          } else {
            this.numberOfRecords = 0;
            this.page = 2;
            this.answers = resp;
          }
        },
        err => this.router.navigate(['/bad_request']));
    }
  }
  // onTimeTableNavigate(subject: Subject) {
  //   this.router.navigate(['./timetable'], {queryParams: {'subject_id': subject.subject_id}, relativeTo: this.activatedRoute.parent});
  // }
  // onTestsNavigate(subject: Subject) {
  //   this.router.navigate(['subject/tests'], {queryParams: {'subject_id': subject.subject_id}, relativeTo: this.activatedRoute.parent});
  // }

  // Method for opening editing and deleting common modal window

  add() {
    this.popup.sendItem(new Answer(), 'answer');
    this.popup.showModal();
  }
  edit(answer: Answer) {
    this.popup.sendItem(answer);
    this.popup.showModal();
  }
  del(answer: Answer) {
    this.popup.deleteEntity(answer);
  }
  formSubmitted(inputedAnswer) {
    if (!inputedAnswer.answer_id) {
      this.answersService.createAnswer(inputedAnswer);
        this.numberOfRecords++;
        this.getAnswersRange();
        $('#add_edit_deletePopup').modal('hide');
    } else {
      this.answersService.updateAnswer(inputedAnswer);
        this.getAnswersRange();
        $('#add_edit_deletePopup').modal('hide');
    }
  }
  deleteAnswer(deletedAnswer) {
    this.deleteRecordByIdService.deleteRecordsById('answer', deletedAnswer.answer_id)
      .subscribe(() => {
        this.numberOfRecords--;
        this.getAnswersRange();
      });
  }
}
