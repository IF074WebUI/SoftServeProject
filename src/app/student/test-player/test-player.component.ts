import {Component, OnInit} from '@angular/core';
import {TestPlayerService} from './test-player.service';
import {ActivatedRoute} from '@angular/router';
import {Test} from '../../admin/tests/test';
import {GetTestsBySubjectService} from '../../admin/services/get-tests-by-subject.service';
import {Answer} from '../../admin/answers/answer';
import {TestDetail} from '../../admin/test-detail/testDetail';
import {ToastsManager} from 'ng2-toastr';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {TestsService} from '../../admin/services/tests.service';
import {FormGroup} from "@angular/forms/src/model";
import {FormBuilder, FormControl} from "@angular/forms";
import {LoginService} from "../../login/login.service";

export class CheckAnswers {
  private numberOfQuestion: number;
  private answerId: string;
  constructor(numberOfQuestion, answerId ) {
    this.numberOfQuestion = numberOfQuestion;
      this.answerId = answerId;
  }
}
export class CheckAnswers {
  private numberOfQuestion: number;
  private answerId: string;
  constructor(numberOfQuestion, answerId ) {
    this.numberOfQuestion = numberOfQuestion;
      this.answerId = answerId;
  }
}

export class Question {
  question_id: number;
  test_id: number;
  question_text: string;
  level: number;
  type: number;
  attachment?: any;
  answers: Answer[];
  true_answer: boolean;
}

@Component({
  selector: 'dtester-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss'],
  providers: [GetTestsBySubjectService],
})
export class TestPlayerComponent implements OnInit {
  testDuration: number;
  test_id: number;
  test: Test;
  questions: Question[] = [];
  question: Question;
  allAnswers: CheckAnswers[] = [];
  start: boolean;
  finish: boolean;
  user_id: number;
  test_details: TestDetail[] = [];
  answers: Answer[];
  ticks: number;
  currentUnixTime: number;
  minutesDisplay: string;
  secondsDisplay: string;
  SECONDS_IN_MINUTE: number;
  startunixTime: number;
  endUnixTime: number;
  unixTimeLeft: number;
  MILLISECONDS_IN_SECOND: number;
  timer: any;
  timerForDisplay: any;
  currentAnswer: Array<string> = [];
  statusTimer: string;
  PERSENT: number;
  DANGER_COLOR: string;
  STATUS_COLOR: string;
  DANGER_STATUS: number;
  availability: any;
  testName: string;
  answersFrom: FormGroup;

  NEXT_QUESTION = 'Наступне питання';
  ENTER_ANSWER = 'Ввести відповідь';
  MARKED = 'Marked for review';
  FINISH = 'Завершити тест';
  START = 'Почати тест';
  QUESTION = 'Питання №';
  SAVE_ANSWER = 'Зберети відповідь';
  RESULTS = 'Зверегти результати';
  FINISH_DIALOG = 'Тест завершено';


  TypeOfAnswers = {
  '1': 'singlechoise',
  '2': 'multichoise',
  '3': 'inputfield'
};

constructor(
              private test_player: TestPlayerService,
              private route: ActivatedRoute,
              private toastr: ToastsManager,
              private testService: TestsService,
              private fb: FormBuilder,
              private loginService: LoginService
) {
    this.ticks = 0;
    this.minutesDisplay = '00';
    this.secondsDisplay = '00';
    this.SECONDS_IN_MINUTE = 60;
    this.MILLISECONDS_IN_SECOND = 100;
    this.PERSENT = 100;
    this.DANGER_STATUS = 18;

  }

  ngOnInit() {
    this.test_id = this.route.snapshot.queryParams['testId'];
    this.testDuration = +this.route.snapshot.queryParams['test_duration'] * this.SECONDS_IN_MINUTE;
    this.getTestDetails();
    this.testService.getTestById(this.test_id)
      .subscribe(
        resp => this.testName = resp[0]['test_name'],
        error => this.toastr.error(error)
      );
    this.createForm();
  }

  createForm() {
    this.answersFrom = this.fb.group({
      singlechoise: '',
      multichoise: '',
      inputfield: ''
    });
  }

  getTestDetails() {
    this.test_player.getTestDetail(this.test_id).subscribe(resp => {
      this.test_details = resp;
    }, error => this.toastr.error(error));
  }


  startTest() {
    this.loginService.checkLogged()
      .flatMap(response => this.user_id = response['id'] );
        return this.loginService.checkLogged()
          .subscribe(res => { this.test_player.checkSecurity(+res['id'], this.test_id)
            .subscribe(resp => {console.log(resp); }, error => this.toastr.error(error));
            this.getTime();
            this.start = true;
            if (this.start) {
              this.startTimer();


// Olena

              const answers$ = this.test_player.getQuestions(this.test_details).do(resp => {
                this.questions = resp;
                this.question = resp[0];
              })
                .switchMap(resp => this.test_player.getAnswers(resp));

              answers$.subscribe(response => {
                this.questions['answers'] = response;
              }, error => this.toastr.error(error));
            } else {
              this.toastr.error('Prohibited');
            } })

  }

  next(type: string) {
    let currentIndex = this.questions.indexOf(this.question);
    let current = new CheckAnswers(String(currentIndex + 1), this.answersFrom.controls[this.TypeOfAnswers[type]].value);
     this.allAnswers.push(current);
   this.test_player.saveData(this.allAnswers).subscribe(resp => this.toastr.success(resp));
    let newIndex = currentIndex === this.questions.length - 1 ? 0 : currentIndex + 1;
    this.question = this.questions[newIndex];
  }

  goToAnswers(number: number) {
    this.question = this.questions[number - 1];
  }

  finishTest() {
    this.stopTimer();
    this.toastr.success('Test Finished');
    this.test_player.resetSessionData().subscribe(error => this.toastr.error(error));
  }

  saveResults() {
    this.test_player.getData().do(resp =>
    // {let Answers = [];
    // resp.forEach((obj) =>
    // Answers.push({obj['numberOfQuestion']})
    // }
      console.log(resp)
    ).flatMap(resp => this.test_player.checkResults(resp)).subscribe(resp => console.log(resp));
  }


  // Mykola

  getTime() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
        this.startunixTime = +res['unix_timestamp'] * 10;
        this.endUnixTime = this.startunixTime + this.testDuration;
        this.unixTimeLeft = this.testDuration;
        // this.startTimer();
      });
  }


  startTimer() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
          this.currentUnixTime = +res['unix_timestamp'] * 10;
          this.showTimer();
        },
        error => this.toastr.error(error));
  }

  showTimer() {
    let timer = setInterval(() => {
      if (this.unixTimeLeft >= 0) {
        this.secondsDisplay = this.digitizeTime(Math.floor((this.unixTimeLeft / 10) % 60));
        this.statusTimer = (this.unixTimeLeft / (this.testDuration / this.PERSENT)).toFixed(2) + '%';
        this.minutesDisplay = this.digitizeTime(Math.floor(this.unixTimeLeft / 600 ));
        this.unixTimeLeft = this.unixTimeLeft - 1;
      } else {
        this.toastr.error('Час закінчився');
        clearInterval(timer);
        this.finishTest();
      }
    }, 100);
  }

  checkUnixTime() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
        if (+res['unix_timestamp'] * 10 < this.endUnixTime) {
          this.unixTimeLeft = (this.endUnixTime - (+res['unix_timestamp'] * 10));
        } else if (+res['unix_timestamp']* 10 > this.endUnixTime) {
          this.finishTest();
        }
      });
  }

  getArrayOfNumbers(array: Question[]) {
    let ArrayOfNumbers = [];
    for (let j = 1; j <= array.length; j++) {
      ArrayOfNumbers.push(j);
    }
    return ArrayOfNumbers;
  }

  stopTimer() {
    clearInterval(this.timer);
  };

  digitizeTime(value: any) {
    return value <= 9 ? '0' + value : value;
  };

  checkProgresColor() {
    let status = parseInt(this.statusTimer, 0);
   return 'hsl(' + status + ',100%, 50%)';
  };

}
