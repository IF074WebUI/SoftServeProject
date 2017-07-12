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
import {FormGroup} from '@angular/forms/src/model';
import {FormBuilder} from '@angular/forms';
import {LoginService} from '../../login/login.service';


export class GetMarks {
  'full_mark': number;
  'number_of_true_answers': number;
}

export class CheckAnswers {
  private question_id: number;
  private answer_ids: Array<number>;

  constructor(question_id, answer_ids) {
    this.question_id = question_id;
    this.answer_ids = answer_ids;
  }
}

export class Question {
  question_id: number;
  test_id: string;
  question_text: string;
  level: string;
  type: string;
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
  testPlayerStartData: any;
  currentAnswer: Array<string> = [];
  statusTimer: string;
  PERSENT: number;
  DANGER_STATUS: number;
  msg: string;
  testName: string;
  answersFrom: FormGroup;
  selectedAnswers: any[] = [];
  marks: GetMarks[] = [];
  timeFinish: boolean;
  questionsIds: Array<number> = [];
  currentQuestionId: number;


  NEXT_QUESTION = 'Наступне питання';
  ENTER_ANSWER = 'Ввести відповідь';
  MARKED = 'Marked for review';
  FINISH = 'Завершити тест';
  START = 'Почати тест';
  QUESTION = 'Питання №';
  SAVE_ANSWER = 'Зберети відповідь';
  RESULTS = 'Зверегти результати';
  CONFIRM_FINISH = 'Завершення тесту';
  SAVE: string;
  CONFIRMATION_DIALOG = 'Зберегти результати і завершити тест?';
  BACK = 'Повернутися до тесту';


  TypeOfAnswers = {
    '1': 'singlechoise',
    '2': 'multichoise',
    '3': 'inputfield'
  };

  constructor(private test_player: TestPlayerService,
              private route: ActivatedRoute,
              private toastr: ToastsManager,
              private testService: TestsService,
              private fb: FormBuilder,
              private loginService: LoginService) {
    this.ticks = 0;
    this.minutesDisplay = '00';
    this.secondsDisplay = '00';
    this.SECONDS_IN_MINUTE = 60;
    this.MILLISECONDS_IN_SECOND = 100;
    this.PERSENT = 100;
    this.DANGER_STATUS = 18;
    this.testPlayerStartData = {
      studentId: 0,
      testId: 0,
      testDuration: 0
    };

  }

  ngOnInit() {
    this.test_player.testPlayerIdData
      .subscribe(data => {
        this.testPlayerStartData.studentId = data.studentId;
        this.testPlayerStartData.testId = +data.testId;
        this.testPlayerStartData.testDuration = data.testDuration;
      });
    this.testDuration = (+this.testPlayerStartData.testDuration) * this.SECONDS_IN_MINUTE * 10;
    this.test_id = this.testPlayerStartData.testId;
    this.getTestDetails();
    this.testService.getTestById(this.testPlayerStartData.testId)
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
    this.test_player.getTestDetail(this.testPlayerStartData.testId).subscribe(resp => {
      this.test_details = resp;
    }, error => this.toastr.error(error));
  }


  prepareQuestionForTest(questions: Array<number[]>): Array<number> {
    let tempArr: Array<number> = [];

    questions.forEach((elem: any) => {
      elem.forEach(item => tempArr.push(+item['question_id']));
    });
    return tempArr;
  }

  startTest() {
    this.startTimer();
    this.test_player.checkSecurity(+this.testPlayerStartData.studentId, this.testPlayerStartData.testId)
      .subscribe(resp => {
          if (resp['response'] === 'ok') {
            this.start = true;
            this.test_player.getQuestions(this.test_details)
              .do((questions: Array<number> | any) => {
                this.questionsIds = this.prepareQuestionForTest(questions);
                return this.questions;
              })
              .subscribe(respon => {
                this.showQuestions(0);
                localStorage.setItem('questionsId', 'this.questionsIds');
                // this.questionsIds = respon;
              });

          } else {
            this.msg = resp['response'];
          }
        },
        error => this.toastr.error(error));
    console.log(this.questionsIds);
  };

  showQuestions(numberOfQuestion: number) {
    console.log(this.questionsIds);

    this.test_player.getQuestionById(this.questionsIds[numberOfQuestion]).map(resp => resp[0]).do(resp => {
      this.question = resp;
      console.log(resp);
    })
      .flatMap(respo => this.test_player.getAnswersById(respo['question_id']))
      .subscribe(response => {
        this.currentQuestionId = response['question_id'];
        this.question['answers'] = response;
        console.log(this.question['answers']);
      }, error => this.toastr.error(error));
  }

  toggleMultiSelect(event, val) {
    event.preventDefault();
    if (this.selectedAnswers.indexOf(val) == -1) {
      this.selectedAnswers = [...this.selectedAnswers, +val];
    } else {
      this.selectedAnswers = this.selectedAnswers.filter((elem) =>
      elem !== val);
    }

  }


  next(type: string) {
    if (
      type !== '2'
    ) {
      this.selectedAnswers = [];
      this.selectedAnswers.push(this.answersFrom.controls[this.TypeOfAnswers[type]].value);
    }
    let currentIndex = +this.questionsIds.indexOf(this.question['question_id']);
    let current = new CheckAnswers(String(currentIndex + 1), this.selectedAnswers);
    this.allAnswers.push(current);
    this.test_player.saveData(this.allAnswers).subscribe(resp => this.toastr.success(resp['response']));
    let newIndex = currentIndex === this.questionsIds.length - 1 ? 0 : currentIndex + 1;
    this.question['question_id'] = this.questionsIds[newIndex];
    this.goToQuestion(this.question['question_id']);
  }

  goToQuestion(number: number) {
    this.showQuestions(number);
 //   this.question = this.questions[number - 1];
  }

  finishTest() {
    this.stopTimer();
    this.toastr.success('Test Finished');
    console.log(this.marks);
    this.test_player.resetSessionData().subscribe(error => this.toastr.error(error));
    this.answersFrom.reset();
  }

  saveResults() {
    this.test_player.getData().do(resp => {
        JSON.parse(resp);
        console.log(resp);
      }
    ).flatMap(resp => this.test_player.checkResults(resp)).subscribe(resp => this.marks = resp);
    this.finish = true;
  }

  backToTest() {
    this.timeFinish = this.unixTimeLeft >= 0 ? true : false;
    this.finish = false;

  }

  getArrayOfNumbers(array: Question[]) {
    let ArrayOfNumbers = [];
    for (let j = 1; j <= array.length; j++) {
      ArrayOfNumbers.push(j);
    }
    return ArrayOfNumbers;
  }

  startTimer() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
          this.startunixTime = +res['unix_timestamp'] * 10;
          this.endUnixTime = this.startunixTime + this.testDuration;
          this.unixTimeLeft = this.testDuration;
          this.showTimer();
        },
        error => this.toastr.error(error));
  }

  showTimer() {
    let timer = setInterval(() => {
      if (this.unixTimeLeft >= 0) {
        this.secondsDisplay = this.digitizeTime(Math.floor((this.unixTimeLeft / 10) % 60));
        this.statusTimer = (this.unixTimeLeft / (this.testDuration / this.PERSENT)).toFixed(2) + '%';
        this.minutesDisplay = this.digitizeTime(Math.floor(this.unixTimeLeft / 600));
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
        } else if (+res['unix_timestamp'] * 10 > this.endUnixTime) {
          this.finishTest();
        }
      });
  }

  stopTimer() {
    clearInterval(this.timer);
  };

  digitizeTime(value: any) {
    return value <= 9 ? '0' + value : value;
  };

  checkProgresColor() {
    let status = Math.floor(parseInt(this.statusTimer, 0) * 2.55);
    return 'rgb(' + '188, 0, ' + status;
  };

}

