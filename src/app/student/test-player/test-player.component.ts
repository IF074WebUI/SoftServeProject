import {Component, OnInit} from '@angular/core';
import {TestPlayerService} from './test-player.service';
import {GetTestsBySubjectService} from "../../admin/services/get-tests-by-subject.service";
import {Answer} from "../../admin/answers/answer";
import {Observable} from "rxjs/Observable";
import {TestDetail} from "../../admin/test-detail/testDetail";
import {ActivatedRoute} from "@angular/router";

export class Object {
  public attempts: number;
  public enabled: number;
  public subject_id: number;
  public tasks: number;
  public test_id: number;
  public test_name: string;
  public time_for_test: number;

  constructor(
              attempts,
              enabled,
              subject_id,
              tasks,
              test_id,
              test_name,
              time_for_test,
  ) {
    this.attempts = attempts;
    this.enabled = enabled;
    this.subject_id = subject_id;
    this.tasks = tasks;
    this.test_id = test_id;
    this.test_name = test_name;
    this.time_for_test = time_for_test;
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
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.css'],
  providers: [GetTestsBySubjectService]
})
export class TestPlayerComponent implements OnInit {
  test_id: number;
  subject_id;
  Alltests: Object[] = [];
  test: Object;
  current_test_id: number;
  questions1: Array<Object>;
  questions2: Array<Object>;
  questions3: Array<Object>;

  currentQuestion: Question;
  start: boolean;
  i: number = 0 ;
  test_details: TestDetail[] = [];
  level: number = 1;

  constructor(
    private test_player: TestPlayerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    let testRoute = this.route.snapshot.queryParams['testId'];
    this.test_id = +testRoute;
    console.log(this.test_id);
    this.getTestDetails();
 //   this.subject_id = '2';
 //   this.getTestBySubject(this.subject_id);
  }

  //
  // getTestBySubject(id: number): void {
  //   this.test_player.getTestDetatilBuTest(id).subscribe(resp => {
  //     this.Alltests = <Object[]> resp;
  //   });
  // }

  getTestDetails() {
    this.test_player.getTestDetail(this.test_id).subscribe(resp => {this.test_details = resp; console.log(this.test_details);
   });
  }

  startTest() {
   // this.tasks = test.tasks;
   // console.log(this.test_details[this.i].tasks);
    this.test_player.getQuestionsByLevelRandom(this.test_id,  this.level,  1).subscribe(resp  => {this.questions1 = resp;
    console.log(this.questions1)});
    this.start = true;
    console.log(this.questions1);
    this.test_player.getQuestionsByLevelRandom(this.test_id, 2,  6).subscribe(resp => this.questions2 = resp);
    this.test_player.getQuestionsByLevelRandom(this.test_id, 3,  1).subscribe(resp => this.questions2 = resp);
  }

  // ShowQuestionsByLevel(level: number){
  //   console.log(this.test_details[this.i].tasks);
  //   this.test_player.getQuestionsByLevelRandom(this.test_id, level,  this.test_details[this.i].tasks).subscribe(resp => this.questions2 = resp);
  // }

  // nextQuestion() {
  //   if (this.i <= this.test_details.length){
  //   ++this.i;
  //   this.test_player.getQuestionsByLevelRandom(this.test_id, this.level,  this.test_details[this.i].tasks).subscribe(resp => this.questions = resp);
  // } else {console.log('no questions'); }}
  //

}
