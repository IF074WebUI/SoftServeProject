import {Component, OnInit} from '@angular/core';
import {TestPlayerService} from './test-player.service';
import {ActivatedRoute} from '@angular/router';
import {Test} from '../../admin/tests/test';
import {GetTestsBySubjectService} from '../../admin/services/get-tests-by-subject.service';
import {Answer} from '../../admin/answers/answer';
import {TestDetail} from '../../admin/test-detail/testDetail';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import {current} from "codelyzer/util/syntaxKind";
import { Observable, Subscription } from 'rxjs/Rx';

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
  selector: 'app-test-player',
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
//  i: number;
  student_id: string;
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

    NEXT_QUESTION = 'Наступне питання';
  PREV_QUESTION = 'Попереднє питання';

  constructor(private test_player: TestPlayerService,  private route: ActivatedRoute) {
  //  this.i = 0;
    this.ticks = 0;
    this.minutesDisplay = '99';
    this.secondsDisplay = '59';
    this.SECONDS_IN_MINUTE = 60;
    this.MILLISECONDS_IN_MINUTE = 1000;
  }

  ngOnInit() {
    this.test_id = this.route.snapshot.queryParams['testId'] || 1;
    this.student_id = this.route.snapshot.queryParams['user_id'];
    this.testDuration = +this.route.snapshot.queryParams['test_duration'] * this.SECONDS_IN_MINUTE;
    this.getTestDetails();
  }
  getTestDetails() {
    this.test_player.getTestDetail(this.test_id).subscribe(resp => {
      this.test_details = resp;
    });
  }


  startTest() {
    this.getTime()
    this.start = true;
    const answers$ = this.test_player.getQuestions(this.test_details).do(resp => {this.questions = resp; this.question = resp[0]; })
      .switchMap(resp => this.test_player.getAnswers(resp));

    answers$.subscribe(response => {this.questions['answers'] = response; console.log(this.questions)});
  }

  previous() {
    let currentIndex = this.questions.indexOf(this.question);
    let newIndex = currentIndex === 0 ? this.questions.length - 1 : currentIndex - 1;
    this.question = this.questions[newIndex];
  }

  next() {
    let currentIndex = this.questions.indexOf(this.question);
    let newIndex = currentIndex === this.questions.length - 1 ? 0 : currentIndex + 1;
    this.question = this.questions[newIndex];
  }
  onValueChanged($event) {
    console.log($event.target.value);
  }
  // viewQuestionsByTest(){
  //   this.test_player.getQuestions()
  // }

  getTime() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
        this.startunixTime = +res['unix_timestamp'];
        this.endUnixTime = this.startunixTime + this.testDuration;
        this.unixTimeLeft = this.testDuration;
        this.startTimer();
      });
  }

  startTimer () {
    this.timer = setInterval(() => {
      if (this.unixTimeLeft > 0) {
        this.unixTimeLeft--;
      } else {
        this.stopTimer();
      }
    }, this.MILLISECONDS_IN_MINUTE);
    this.showTimer();
  }

  stopTimer() {
    clearInterval(this.timer);
    clearInterval(this.timerForDisplay);
  }
  showTimer() {
    this.timerForDisplay = setInterval(
      () => {
        this.minutesDisplay = this.digitizeTime( Math.floor(this.unixTimeLeft / 60)).toString();
        this.secondsDisplay = this.digitizeTime( Math.floor(this.unixTimeLeft % 60)).toString();
      }, this.MILLISECONDS_IN_MINUTE
    );
  }
  digitizeTime(value: any) {
    return value <= 9 ? '0' + value : value;
  }
}
