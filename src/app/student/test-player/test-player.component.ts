import {Component, OnInit} from '@angular/core';
import {TestPlayerService} from './test-player.service';
import {Router} from '@angular/router';
import {Test} from '../../admin/tests/test';
import {GetTestsBySubjectService} from '../../admin/services/get-tests-by-subject.service';
import {Answer} from '../../admin/answers/answer';
import {TestDetail} from '../../admin/test-detail/testDetail';
import {ToastsManager} from 'ng2-toastr';
import {TestsService} from '../../admin/services/tests.service';
import {FormGroup} from '@angular/forms/src/model';
import {FormBuilder} from '@angular/forms';
import {TestPlayerData} from '../student-profile/TestPlayerData';
import {CheckAnswers, InitialRezults, Question} from '../classes';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

declare var $: any;

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
  question: Question;
  allAnswers: CheckAnswers;
  start: boolean;
  finish: boolean;
  user_id: number;
  answers: Answer[];
  ticks: number;
  minutesDisplay: string;
  secondsDisplay: string;
  SECONDS_IN_MINUTE: number;
  startunixTime: number;
  endUnixTime: number;
  unixTimeLeft: number;
  MILLISECONDS_IN_SECOND: number;
  timer: any;
  testPlayerStartData: TestPlayerData = new TestPlayerData;
  dataForSave: Array<CheckAnswers> = [];
  statusTimer: string;
  PERSENT: number;
  DANGER_STATUS: number;
  msg: string;
  testName: string;
  answersFrom: FormGroup;
  selectedAnswers: Array<number> = [];
  numberOfQuestion: number;
  questionsIds: Array<number> = [];
  marked: Array<boolean> = [];
  maxMarks: number;
  numberOfTasks: number;



  NEXT_QUESTION = 'Перейти на наступне питання';
  ENTER_ANSWER = 'Ввести відповідь';
  MARKED = 'Відмітити питання';
  FINISH = 'Завершити тест';
  START = 'Почати тест';
  QUESTION = 'Питання №';
  CONFIRMATION_DIALOG = 'Зберегти результати і завершити тест?';
  BACK = 'Повернутися до тесту';
  TEST_NAME = 'Назва тесту';
  TEST_DURATION = 'Тривалість тесту';
  HV = 'хвилин';
  CLOSE_MODAL = 'Закрити';
  ATTANTION = 'Увага!';
  PRIMARY_VIOLET_COLOR = '#7e8bfe';
  TIMER_DIVIDER = 10;
  RGB_PERSENT = 2.55;
  RGB_TIMER_STATUS_COLOR = 'rgb(188, 0, ';
  TIMER_SYNHRONIZATION = 100;


  TypeOfAnswers = {
    '1': 'singlechoise',
    '2': 'multichoise',
    '3': 'inputfield'
  };

  constructor(private test_player: TestPlayerService,
              private toastr: ToastsManager,
              private testService: TestsService,
              private fb: FormBuilder,
              private router: Router) {
    this.ticks = 0;
    this.minutesDisplay = '00';
    this.secondsDisplay = '00';
    this.SECONDS_IN_MINUTE = 60;
    this.MILLISECONDS_IN_SECOND = 100;
    this.PERSENT = 100;
    this.DANGER_STATUS = 18;
  }

  ngOnInit() {
    this.getStartData();
    this.createForm();
    if (this.testPlayerStartData.endUnixTime > 0) {
      this.questionsIds = [];
      this.test_player.getData().map(resp => {
        let data: Array<any> = JSON.parse(resp);
        this.questionsIds = [];
        data.forEach(obj => {
          this.questionsIds.push(+obj['question_id']);
        });
        this.startTimer();
        return this.questionsIds;
      }).subscribe(resp => {
        for (let i in this.questionsIds) {
          this.dataForSave[i] = new CheckAnswers(this.questionsIds[i], []);
        }
        this.showQuestions(0);
      });
      this.start = true;
    }
  }

  getTestName() {
    this.testService.getTestById(this.testPlayerStartData.testId)
      .subscribe(
        resp => {
          this.testName = resp[0]['test_name'];
          this.testPlayerStartData.testName = this.testName;
        },
        error => {
          this.msg = error;
          this.openModal();
        }
      );
  }

  onSelect() {
    let n = this.numberOfQuestion - 1;
    if (this.marked[n]) {
      this.marked[n] = false;
      $('.number-box').eq(n).css({'border-color': ''});
    } else {
      this.marked[n] = true;
      $('.number-box').eq(n).css({'border-color': 'red'});
    }
  }


  getStartData() {
    this.test_player.testPlayerIdData
      .subscribe(data => {
          if (data['endUnixTime'] > 0) {
          this.testName = data.testName;
          this.testPlayerStartData.endUnixTime = data.endUnixTime;
          this.testPlayerStartData.testId = data.testId;
          this.testDuration = +data.testDuration;
        } else {
         this.getTestName();
          this.testPlayerStartData.studentId = +data.studentId;
          this.testPlayerStartData.testId = +data.testId;
          this.testDuration = +data.testDuration * this.SECONDS_IN_MINUTE * this.TIMER_DIVIDER;
        }
      });
  }


  createForm() {
    this.answersFrom = this.fb.group({
      singlechoise: '',
      inputfield: ''
    });
  }

  getMaxMarks() {
    this.test_player.getTestDetail(this.testPlayerStartData.testId)
      .subscribe((resp: TestDetail[]) => {
      let arrayAllTasks: Array<number> = resp.map(obj => {return obj['tasks']; });
      this.numberOfTasks = arrayAllTasks.reduce((sum, cur) => {return +sum + +cur; });

        let arrayMaxMarks: Array<number> = resp.map(obj => {return obj['tasks'] * obj['rate']; });
       this.maxMarks = arrayMaxMarks.reduce((sum, cur) => {return +sum + +cur; });
    }, error => {
      this.msg = error;
      this.openModal();
    });
  }


  startTest() {
    this.startTimer();
    this.test_player.checkSecurity(+this.testPlayerStartData.studentId, this.testPlayerStartData.testId)
      .subscribe(resp => {
          if (resp['response'] === 'ok') {
            this.start = true;
            this.numberOfQuestion = 1;
            localStorage.clear();
            this.test_player.getTestDetail(this.testPlayerStartData.testId)
              .flatMap((respon: TestDetail[]) => this.test_player.getQuestions(respon))
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
                  this.openModal();
                  this.resetSessionData();
                });

          } else {
            this.msg = resp['response'];
            this.openModal();
          }
        },
        error => {
          this.msg = error;
          this.openModal();
        });
  }


  prepareQuestionForTest(questions: Array<number[]>): Array<number> {
    let tempArr: Array<number> = [];
    questions.forEach((elem: any) => {
      elem.forEach(item => tempArr.push(+item['question_id']));
    });
    return tempArr;
  }

  showQuestions(numberOfQuestion: number) {
    this.numberOfQuestion = numberOfQuestion + 1;
    this.answersFrom.reset();
    this.test_player.getQuestionById(this.questionsIds[numberOfQuestion])
      .map(resp => resp[0]).do(resp => {
      this.question = resp;
      if (this.question['type'] === '3') {
        let currentAnswers = localStorage.getItem(String(this.question['question_id']));
        this.answersFrom.controls[this.TypeOfAnswers[this.question['type']]].setValue(currentAnswers);
      }
    }).filter(question => question['type'] !== '3')
      .flatMap(resp => this.test_player.getAnswersById(resp['question_id']))
      .subscribe(resp => {
        this.question['answers'] = resp;
        resp.forEach(item => this.answersFrom.addControl(item['answer_id'], this.fb.control(false)));
        let currentAnswers = localStorage.getItem(String(this.question['question_id']));
        if (currentAnswers) {
          if (this.question['type'] === '2') {
            let array = currentAnswers.split(',');
            array.forEach(string => this.answersFrom.controls[string].setValue(true)
            );
          } else {
            this.answersFrom.controls[this.TypeOfAnswers[this.question['type']]].setValue(currentAnswers);
          }
        }
      }, error => {
        this.msg = error;
        this.openModal();
      });
    this.selectedAnswers = [];
  }


  saveCurrentAnswer(question ?: Question, questionId ?: number) {
    let currentQuestion = questionId ? this.test_player.getQuestionById(questionId).subscribe(resp => question = resp) : question;
    if (question['type'] === '2') {
      question['answers'].map(answer => {
        return answer['answer_id'];
      }).forEach(id => {
        let value = this.answersFrom.controls[id].value;
        if (value) {
          this.selectedAnswers.push(id);
        }
      });
    } else {
      let value = this.answersFrom.controls[this.TypeOfAnswers[currentQuestion['type']]].value;
      value != null ? this.selectedAnswers.push(value) : this.selectedAnswers = [];
    }

    let currentQuestionId = +(currentQuestion['question_id']);
    let questionIndex = this.questionsIds.indexOf(currentQuestionId);
    this.allAnswers = new CheckAnswers(currentQuestionId, this.selectedAnswers);
    this.dataForSave[questionIndex] = this.allAnswers;
    localStorage.setItem(String(currentQuestionId), this.selectedAnswers.toString());
    if (this.allAnswers['answer_ids'].length === 0) {
      $('.number-box').eq(questionIndex).css({'backgroundColor': ''});

    } else {
      $('.number-box').eq(questionIndex).css({'backgroundColor': this.PRIMARY_VIOLET_COLOR});
    }

    this.test_player.saveData(this.dataForSave).subscribe(resp => this.toastr.success);

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
    this.test_player.getData()
      .flatMap(resp => this.test_player.checkResults(resp))
      .map(resp => {
        let data = new InitialRezults(resp['full_mark'], resp['number_of_true_answers'], this.numberOfTasks, this.maxMarks, this.testName);
        return data;
      }).subscribe(resp => {
      this.stopTimer();
      this.answersFrom.reset();
      localStorage.clear();
      this.resetSessionData();
      this.test_player.sendRezults(resp);
    });
    this.router.navigate(['student/test-rezults']);
  }

  resetSessionData() {
    this.test_player.resetSessionData().subscribe(res => {
    });
  }

  saveResults() {
    this.saveCurrentAnswer(this.question);
    this.finish = true;
    this.getMaxMarks();
  }

  backToTest() {
    this.finish = false;
  }

  getArrayOfNumbers(array: Question[]) {
    let ArrayOfNumbers = [];
    for (let j = 1; j <= array.length; j++) {
      ArrayOfNumbers.push(j);
    }
    return ArrayOfNumbers;
  }

  openModal() {
    $('#message').modal('show');
  }

  closeModal() {
    $('#message').modal('hide');
    this.router.navigate(['./student']);

  }

  startTimer() {
    this.test_player.getCurrentTime()
      .subscribe(res => {
          if (this.testPlayerStartData.endUnixTime > 0) {
            this.endUnixTime = this.testPlayerStartData.endUnixTime * this.SECONDS_IN_MINUTE;
            this.unixTimeLeft = this.testPlayerStartData.endUnixTime - (+res['unix_timestamp'] * this.TIMER_DIVIDER);
            this.showTimer();
          } else {
            this.startunixTime = +res['unix_timestamp'] * this.TIMER_DIVIDER;
            this.unixTimeLeft = this.testDuration;
            this.endUnixTime = this.startunixTime + this.testDuration;
            this.showTimer();
            this.saveEndTime();
          }
        },
        error => {
          this.toastr.error(error);
        });
  }

  showTimer() {
    let timer = setInterval(() => {
      if (this.unixTimeLeft >= 0) {
        this.secondsDisplay = this.digitizeTime(Math.floor((this.unixTimeLeft / this.TIMER_DIVIDER) % this.SECONDS_IN_MINUTE));
        this.statusTimer = (this.unixTimeLeft / (this.testDuration / this.PERSENT)).toFixed(2) + '%';
        this.minutesDisplay = this.digitizeTime(Math.floor(this.unixTimeLeft / (this.TIMER_DIVIDER * this.SECONDS_IN_MINUTE)));

        this.unixTimeLeft = this.unixTimeLeft - 1;
      } else {
        this.toastr.error('Час закінчився');
        clearInterval(timer);
        this.finishTest();
      }
    }, this.TIMER_SYNHRONIZATION);
  }


  stopTimer() {
    clearInterval(this.timer);
  }
  ;

  digitizeTime(value: any) {
    return value <= 9 ? '0' + value : value;
  };

  checkProgresColor() {
    let status = Math.floor(parseInt(this.statusTimer, 0) * this.RGB_PERSENT);
    return this.RGB_TIMER_STATUS_COLOR + status;
  };

  saveEndTime() {
    if (this.testPlayerStartData.endUnixTime > 0) {
      console.log('you have unfinished test');
    } else {

      this.test_player.saveEndTime(this.endUnixTime, this.testPlayerStartData.testId, this.testDuration, this.testPlayerStartData.testName)
        .subscribe(res => res);
    }
  }

}
