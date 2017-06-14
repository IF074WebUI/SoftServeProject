import {Component, OnInit, ViewChild} from '@angular/core';
import {Answer} from './answer';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AnswersService} from '../services/answers.service';
import {ANSWER_CONFIG} from '../universal/dynamic-form/config';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';


@Component({
  selector: 'dtester-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {
  readonly ANSWERS_HEADERS: string[] = ['№', 'Текст відповіді', 'Правильність відповіді'];
  readonly IGNORE_PROPERTIES: string[] = ['question_id', 'answer_id', 'attachment'];
  readonly DISPLAY_PROPERTIES_ORDER: string[] = ['answer_text', 'answer_true'];
  readonly SORT_PROPERTIES: string[] = ['answer_text'];

  answers: Answer[];
  page = 1;
  countPerPage = 5;   /*number of the records for the stating page*/
  count: number;
  headers: string[];            /* array of headers */
  ignoreProperties: string[];
  sortProperties: string[];
  displayPropertiesOrder: string[];
  editName = '';

  public question_id: number;
  public noRecords: boolean = false;


  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = ANSWER_CONFIG;

  constructor(private answersService: AnswersService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastsManager,
              private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.headers = this.ANSWERS_HEADERS;
    this.ignoreProperties = this.IGNORE_PROPERTIES;
    this.sortProperties = this.SORT_PROPERTIES;
    this.displayPropertiesOrder = this.DISPLAY_PROPERTIES_ORDER;
    this.getAnswers();
    this.getCount();
  }




  getAnswers(): void {
    this.spinnerService.showSpinner();
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.answersService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => {this.answers = resp;
        this.spinnerService.hideSpinner(); }, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.answersService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }
  getAnswerByQuestion() {
    this.answersService.getAnswerByQuestion(this.question_id)
      .subscribe(
        data => {
          if (data.response === 'no records') {
            this.noRecords = true;
          }
          if (data.length) {
            this.answers = data;
            this.noRecords = false;
          }
        },
        error => console.log('error: ', error)
      );
  }

  add():void {
    this.popup.sendItem(new Answer(), 'Answer');
    this.popup.showModal();
  }

  edit(answer: Answer):void {
    this.popup.sendItem(answer);
    this.popup.showModal();
  }

  delete(answer: Answer):void {
    this.popup.deleteEntity(answer);
  }

  formSubmitted(answer: Answer): void {
    if (answer['answer_id']) {
      console.log(answer);
      this.answersService.edit(answer).subscribe(resp => {
          this.popup.cancel();
          this.getAnswers();
          this.toastr.success(`Відповідь ${answer.answer_text} успішно відредагована`);
        },
        err => this.router.navigate(['/bad_request']));
    } else {
      delete answer.answer_id;
      this.answersService.save(answer).subscribe(resp => {
          this.popup.cancel();
          this.getAnswers();
          this.count++;
          this.toastr.success(`Відповідь ${answer.answer_text} успішно збережена`);
        },
        err => this.router.navigate(['/bad_request']));
    }
  }

  // getGroupsBySpeciality(speciality: Speciality):void {
  //   this.router.navigate(['./group'], {queryParams: {'specialityId': speciality.speciality_id}, relativeTo: this.activatedRoute.parent});
  // }

  submitDelete(answer: Answer): void {
    this.answersService.delete(answer['answer_id'])
      .subscribe(resp => {
          --this.count;
          this.getAnswers();
          this.toastr.success(`Спеціальність ${answer.answer_text} успішно видалена`);
        },
        err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number): void {
    this.page = page;
    this.getAnswers();
  }

  changeCountPerPage(itemsPerPage: number): void {
    this.countPerPage = itemsPerPage;
    this.getAnswers();
  }

  startSearch(criteria: string):void {
    if (criteria === '') {
      this.getAnswers();
      this.getCount();
    } else {
      this.spinnerService.showSpinner();
      this.answersService.searchByName(criteria).subscribe(resp => {
          if (resp['response'] === 'no records') {
            this.answers = [];
            this.count = this.answers.length;
            this.page = 2;
          } else {
            this.count = 0;
            this.page = 2;
            this.answers = resp;
          }
          this.spinnerService.hideSpinner();
        },
        err => this.router.navigate(['/bad_request']));
    }
  }

}
