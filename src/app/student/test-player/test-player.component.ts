import {AfterContentChecked, Component, OnInit} from '@angular/core';
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

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

declare var $: any;

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

export class InitialRezults {
  number_of_true_answers: number;
  number_of_all_answers: number;
  full_mark: number;
  max_mark: number;
  test_name: string;

  constructor(full_mark, number_of_true_answers, max_mark, number_of_all_answers, test_name) {
    this.full_mark = full_mark;
    this.number_of_true_answers = number_of_true_answers;
    this.max_mark = max_mark;
    this.number_of_all_answers = number_of_all_answers;
    this.test_name = test_name;
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

export class TestPlayerComponent implements OnInit, AfterContentChecked {
  testDuration: number;
  test_id: number;
  test: Test;
  question: Question;
  allAnswers: CheckAnswers;
  start: boolean;
  finish: boolean;
  user_id: number;
  test_details: TestDetail[] = [];
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
  testPlayerStartData: any;
  dataForSave: Array<CheckAnswers> = [];
  statusTimer: string;
  PERSENT: number;
  DANGER_STATUS: number;
  msg: string;
  testName: string;
  answersFrom: FormGroup;
  selectedAnswers: Array<number> = [];
  numberOfQuestion: number;
  marks: any;
  questionsIds: Array<number> = [];
  marked: Array<boolean> = [];


  NEXT_QUESTION = 'Наступне питання';
  ENTER_ANSWER = 'Ввести відповідь';
  MARKED = 'Marked for review';
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
    this.testPlayerStartData = {
      studentId: 0,
      testId: 0,
      testDuration: 0,
      startLogTime: 0,
      testLogId: 0,
      testLogDuration: 0,
      endUnixTime: 0
    };
  }

  ngOnInit() {
    this.getStartData();
    this.createForm();
    console.log(this.testPlayerStartData.endUnixTime);
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
    } else {
      localStorage.clear();
      this.getTestDetails();
      this.testService.getTestById(this.testPlayerStartData.testId) // special for Mykola! Please use your subject for sending me this testName!
        .subscribe(
          resp => {
            this.testName = resp[0]['test_name'];
          },
          error => {
            this.msg = error;
            this.openModal();
          }
        );
    }
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
    // this.test_player.getEndTime()
    //   .subscribe(response => {
    //     let time = JSON.parse(response);
    //     if (time['endTime'] > 0) {
    //       this.router.navigate(['student/student-main']);
    //     }
    //   })
    this.test_player.testPlayerIdData
      .subscribe(data => {        this.testPlayerStartData.studentId = data['studentId'];
        // if (+data['studentId'] !== 0)
        // {
        //   this.router.navigate(['student/student-main']);
        // } else
        if (data['studentId'] === 0) {
          this.router.navigate(['student/student-main']);
        } else

        if (data['endUnixTime'] > 0) {
          // debugger;
          this.testPlayerStartData.endUnixTime = data['endUnixTime'];
          this.testPlayerStartData.testId = data['testId'];
          this.testDuration = +data.testDuration;
        } else {
          this.testPlayerStartData.studentId = +data.studentId;
          this.testPlayerStartData.testId = +data.testId;
          this.testDuration = +data.testDuration * this.SECONDS_IN_MINUTE * 10;
        }
      });
  }

  createForm() {
    this.answersFrom = this.fb.group({
      singlechoise: '',
      multichoise: false,
      inputfield: ''
    });
  }

  getTestDetails() {
    this.test_player.getTestDetail(this.testPlayerStartData.testId).subscribe(resp => {
      this.test_details = resp;
    }, error => {
      //  this.toastr.error(error);
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
      let currentAnswers = localStorage.getItem(String(this.question['question_id']));
      console.log(this.selectedAnswers);
      if (this.question['type'] === '2' && currentAnswers) {
        let array = currentAnswers.split(',');
          for (let k of array) {
       //  this.answersFrom.controls[this.TypeOfAnswers[this.question['type']]][k].setValue(true);
          }
      } else {
        this.answersFrom.controls[this.TypeOfAnswers[this.question['type']]].setValue(currentAnswers);
      }
    }).filter(question => question['type'] !== '3')
      .flatMap(resp => this.test_player.getAnswersById(resp['question_id']))
      .subscribe(resp => {
        this.question['answers'] = resp;
      }, error => {
        this.msg = error;
        this.openModal();
      });
    this.selectedAnswers = [];
  }

  ngAfterContentChecked() {
    // let currentAnswers = localStorage.getItem(String(this.question['question_id']));
    // if (this.question['type'] === '2' && currentAnswers) {
    //   let array = currentAnswers.split(',');
    //   for (let k of array) {
    //   }
    // }
  }

  toggleMultiSelect(event, val) {
    event.preventDefault();
    if (!event.target.checked) {
      if (this.selectedAnswers.indexOf(val) !== -1) {
        this.selectedAnswers.splice(this.selectedAnswers.indexOf(val), 1);
      }
    } else {
      this.selectedAnswers.push(+val);
    }
    //   this.options = [
    //     {name:'OptionA', value:'first_opt', checked:true},
    //     {name:'OptionB', value:'second_opt', checked:false},
    //     {name:'OptionC', value:'third_opt', checked:true}
    //   ];
    //   this.getselectedOptions = function() {
    //     alert(this.options
    //       .filter(opt => opt.checked)
    //       .map(opt => opt.value));
    //   }
    // }

  }

  saveCurrentAnswer(question ?: Question, questionId ?: number) {
    let currentQuestion = questionId ? this.test_player.getQuestionById(questionId).subscribe(resp => question = resp) : question;
    if (
      currentQuestion['type'] !== '2'
    ) {
      this.selectedAnswers = [];
      let value = this.answersFrom.controls[this.TypeOfAnswers[currentQuestion['type']]].value;
      value != null ? this.selectedAnswers.push(value) : this.selectedAnswers = [];
    }
    let currentQuestionId = +(currentQuestion['question_id']);
    let questionIndex = this.questionsIds.indexOf(currentQuestionId);
    this.allAnswers = new CheckAnswers(currentQuestionId, this.selectedAnswers);
    this.dataForSave[questionIndex] = this.allAnswers;
    localStorage.setItem(String(currentQuestionId), this.selectedAnswers.toString());
    console.log(this.selectedAnswers);
    console.log(this.dataForSave[questionIndex]['answer_ids']);
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
        let data = new InitialRezults(resp['full_mark'], resp['number_of_true_answers'], 5000, 10000, this.testName);
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
      console.log(res);
    });
  }

  saveResults() {
    this.saveCurrentAnswer(this.question);
    this.finish = true;
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
            this.unixTimeLeft = this.testPlayerStartData.endUnixTime - (+res['unix_timestamp'] * 10);
            this.showTimer();
          } else {
            this.startunixTime = +res['unix_timestamp'] * 10;
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
  }
  ;

  digitizeTime(value: any) {
    return value <= 9 ? '0' + value : value;
  };

  checkProgresColor() {
    let status = Math.floor(parseInt(this.statusTimer, 0) * 2.55);
    return 'rgb(' + '188, 0, ' + status;
  };

  saveEndTime() {
    if (this.testPlayerStartData.endUnixTime > 0) {
      console.log('you have unfinished test');
    } else {

      this.test_player.saveEndTime(this.endUnixTime, this.testPlayerStartData.testId, this.testDuration)
        .subscribe(res => console.log(res));
    }
  }

  getEndTime() {
    this.test_player.getEndTime()
      .subscribe(res => console.log(res),
        error => this.toastr.error(error));
  }
}
