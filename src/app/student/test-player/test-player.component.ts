import {Component, OnDestroy, OnInit} from '@angular/core';
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
import 'rxjs/add/operator/debounceTime';

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
  question_id: number;
  answer_ids: Array<number>;

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
//  questions: Question[] = [];
  question: Question;
  allAnswers: CheckAnswers;
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
  dataForSave: Array<CheckAnswers> = [];
  // currentAnswer: Array<string> = [];
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
  // currentQuestionId: number;


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
      testDuration: 0,
      startLogTime: 0,
      testLogId: 0,
      testLogDuration: 0
    };

  }

  ngOnInit() {
    this.getStartData();
    this.getTestDetails();
    this.testService.getTestById(this.testPlayerStartData.testId)
      .subscribe(
        resp => this.testName = resp[0]['test_name'],
        error => this.toastr.error(error)
      );
    this.createForm();

  }

  getStartData() {
    this.test_player.testPlayerIdData
      .subscribe(data => {
        this.testPlayerStartData.studentId = +data.studentId;
        this.testPlayerStartData.testId = +data.testId;
        this.testDuration = +data.testDuration * this.SECONDS_IN_MINUTE * 10;
        console.log(this.testDuration);
      });
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


  startTest() {
    this.startTimer();
    this.test_player.checkSecurity(+this.testPlayerStartData.studentId, this.testPlayerStartData.testId)
      .subscribe(resp => {
          if (resp['response'] === 'ok') {
            this.start = true;
            this.test_player.getQuestions(this.test_details)
              .do((questions: Array<number> | any) => {
                this.questionsIds = this.prepareQuestionForTest(questions);
                return this.questionsIds;
              })
              .subscribe(respon => {
                  for (let i in this.questionsIds) {
                    this.dataForSave[i] = new CheckAnswers(this.questionsIds[i], []);
                  }
                  this.showQuestions(0);
                },
                error => {
                  this.msg = error;
                  console.log(this.msg);
                  this.toastr.error(error);
                });

          } else {
            this.msg = resp['response'];
          }
        },
        error => this.toastr.error(error));
  };

  prepareQuestionForTest(questions: Array<number[]>): Array<number> {
    let tempArr: Array<number> = [];

    questions.forEach((elem: any) => {
      elem.forEach(item => tempArr.push(+item['question_id']));
    });
    return tempArr;
  }

  showQuestions(numberOfQuestion: number) {
    this.answersFrom.reset();

    this.test_player.getQuestionById(this.questionsIds[numberOfQuestion])
      .map(resp => resp[0]).do(resp => {
      this.question = resp;
      let data = localStorage.getItem(String(this.question['question_id']));
      this.answersFrom.controls[this.TypeOfAnswers[this.question['type']]].setValue(data);
    }).filter(question => question['type'] !== '3')
      .flatMap(resp => this.test_player.getAnswersById(resp['question_id']))
      .subscribe(resp => {
        this.question['answers'] = resp;

      }, error => this.toastr.error(error));
    this.selectedAnswers = [];
  }

  toggleMultiSelect(event, val) {
    event.preventDefault();
    if (this.selectedAnswers.indexOf(val) == -1) {
      this.selectedAnswers = [...this.selectedAnswers, val];
    } else {
      this.selectedAnswers = this.selectedAnswers.filter((elem) =>
      elem !== val);
    }
  }

  saveCurrentAnswer(question?: Question, questionId?: number) {
    let currentQuestion = questionId ? this.test_player.getQuestionById(questionId).subscribe(resp => question = resp) : question;
    if (
      currentQuestion['type'] !== '2'
    ) {
      this.selectedAnswers = [];
      this.selectedAnswers.push(this.answersFrom.controls[this.TypeOfAnswers[currentQuestion['type']]].value);
    }
    let currentQuestionId = +(currentQuestion['question_id']);
    let questionIndex = this.questionsIds.indexOf(currentQuestionId);
    this.allAnswers = new CheckAnswers(currentQuestionId, this.selectedAnswers);
    this.dataForSave[questionIndex] = this.allAnswers;
    localStorage.setItem(String(currentQuestionId), this.selectedAnswers.toString());
    this.test_player.saveData(this.dataForSave).subscribe(resp => this.toastr.success(resp['response']));
  }

  next(prevQuestion: Question) {
    let newIndex = this.questionsIds.indexOf(+prevQuestion['question_id']) === this.questionsIds.length - 1 ? 0 : this.questionsIds.indexOf(+prevQuestion['question_id']) + 1;
    this.goToQuestion(newIndex);
  }

  goToQuestion(number: number) {
    this.saveCurrentAnswer(this.question);
    this.showQuestions(number);
  }

  finishTest() {
    this.stopTimer();
    this.answersFrom.reset();
    localStorage.clear();
    console.log(this.marks);
    this.test_player.resetSessionData().subscribe(error => this.toastr.error(error));
  }

  saveResults() {
    this.finish = true;
    this.test_player.getData().do(resp => {
        //  JSON.parse(resp);
        console.log(resp);
      }
    ).flatMap(resp => this.test_player.checkResults(resp))
      .subscribe(resp => this.marks = resp);
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
            this.unixTimeLeft = this.testDuration;
            this.endUnixTime = this.startunixTime + this.testDuration;
         this.showTimer();
        },
        error => this.toastr.error(error));
  }

  showTimer() {
    console.log(this.testDuration);
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
    this.checkUnixTime();
  }

  checkUnixTime() {
    // debugger;
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
  saveEndTime() {
    this.test_player.saveEndTime(this.testPlayerStartData.studentId, this.endUnixTime)
      .subscribe(res => console.log(res));
  }

  getEndTime() {
    this.test_player.getEndTime()
      .subscribe(res => console.log(res));
  }
}
