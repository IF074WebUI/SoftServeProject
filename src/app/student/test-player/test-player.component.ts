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
import { TestsService } from '../../admin/services/tests.service';


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
  MILLISECONDS_IN_MINUTE: number;
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

  NEXT_QUESTION = 'Наступне питання';
  ENTER_ANSWER = 'Ввести відповідь';
  MARKED = 'Marked for review';
  FINISH = 'Завершити тест';
  START = 'Почати тест';
  QUESTION = 'Питання №';
  SAVE_ANSWER = 'Зберети відповідь';
  RESULTS = 'Зверегти результати';
  FINISH_DIALOG = 'Тест завершено';

  constructor(
    private test_player: TestPlayerService,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    private testService: TestsService,
  ) {
    this.ticks = 0;
    this.minutesDisplay = '00';
    this.secondsDisplay = '00';
    this.SECONDS_IN_MINUTE = 60;
    this.MILLISECONDS_IN_MINUTE = 1000;
    this.PERSENT = 100;
    this.STATUS_COLOR = '#51E000';
    this.DANGER_COLOR = '#FD040E';
    this.DANGER_STATUS = 18;

  }

  ngOnInit() {
    this.test_id = this.route.snapshot.queryParams['testId'] || 1;
    this.user_id = this.route.snapshot.queryParams['user_id'];
    this.testDuration = +this.route.snapshot.queryParams['test_duration'] * this.SECONDS_IN_MINUTE;
    this.getTestDetails();
    this.testService.getTestById(this.test_id)
      .subscribe(
        resp => this.testName = resp[0]['test_name'],
        error => console.log(error)
      );
  }

  getTestDetails() {
    this.test_player.getTestDetail(this.test_id).subscribe(resp => {
      this.test_details = resp,  error => this.toastr.error(error);
    });
  }


  startTest() {
   this.test_player.checkSecurity(this.user_id, this.test_id).subscribe(resp => console.log(resp), error => this.toastr.error(error));
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
     this.toastr.error('Progibited');
    }
  }

  next() {
    let currentIndex = this.questions.indexOf(this.question);
    let newIndex = currentIndex === this.questions.length - 1 ? 0 : currentIndex + 1;
    this.question = this.questions[newIndex];
  }

  goToAnswers(number: number) {
    this.question = this.questions[number - 1];
  }

  finishTest() {
    this.toastr.success('Test Finished');
    this.test_player.resetSessionData().subscribe(resp => console.log(resp));
  }


  // Mykola

  getTime() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
        this.startunixTime = +res['unix_timestamp'];
        this.endUnixTime = this.startunixTime + this.testDuration;
        this.unixTimeLeft = this.testDuration;
        this.startTimer();
      });
  }


  startTimer() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
        this.currentUnixTime = +res['unix_timestamp'];
        this.timer = setInterval(() => {
          if (this.unixTimeLeft > 0) {
            --this.unixTimeLeft;
            this.minutesDisplay = this.digitizeTime(Math.floor(this.unixTimeLeft / 60)).toString();
            this.secondsDisplay = this.digitizeTime(Math.floor(this.unixTimeLeft % 60)).toString();
            this.statusTimer = Math.floor(this.unixTimeLeft / (this.testDuration / this.PERSENT)) + '%';
          } else {
            this.stopTimer();
          }
        }, this.MILLISECONDS_IN_MINUTE);
      });
  }

  checkUnixTime() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
        if (+res['unix_timestamp'] < this.endUnixTime) {
          console.log('time unougtht');
          this.unixTimeLeft = (this.endUnixTime - +res['unix_timestamp']) - 1;
        } else if (+res['unix_timestamp'] > this.endUnixTime) {
          console.log('time end');
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
    let status  = parseInt(this.statusTimer, 0);
    if (status > this.DANGER_STATUS) {
      return this.STATUS_COLOR;
    } else if (status <= this.DANGER_STATUS) {
      return this.DANGER_COLOR;

    }
  };

}
