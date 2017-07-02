import {Component, OnInit} from '@angular/core';
import {TestPlayerService} from './test-player.service';
import {GetTestsBySubjectService} from '../../admin/services/get-tests-by-subject.service';
import {Answer} from '../../admin/answers/answer';
import {Observable} from 'rxjs/Observable';
import {TestDetail} from '../../admin/test-detail/testDetail';
import 'rxjs/add/observable/of';
import {ActivatedRoute, Router} from "@angular/router";
import {Test} from "../../admin/tests/test";

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

  constructor(attempts, enabled,
              subject_id,
              tasks,
              test_id,
              test_name,
              time_for_test) {
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
  styleUrls: ['./test-player.component.scss'],
  providers: [GetTestsBySubjectService],
})
export class TestPlayerComponent implements OnInit {
  test_id: number;
  test: Test;
  questions: Question[] = [];
  question: Question;
  start: boolean;
  i: number;
  student_id: string;
  test_details: TestDetail[] = [];
  level: number = 1;

  NEXT_QUESTION = 'Наступне питання';
  PREV_QUESTION = 'Попереднє питання';

  constructor(private test_player: TestPlayerService,  private route: ActivatedRoute,) {
    this.i = 0;
  }

  ngOnInit() {
    this.test_id = this.route.snapshot.queryParams['testId'] || 1;
    this.student_id = this.route.snapshot.queryParams['user_id'];
 //   this.test_id = 1;
    this.getTestDetails();
  }
  getTestDetails() {
    this.test_player.getTestDetail(this.test_id).subscribe(resp => {
      this.test_details = resp;
    });
  }


  startTest() {
    this.start = true;
    this.test_player.getQuestions(this.test_details, this.i).subscribe(resp => {
      this.questions = resp;
      this.question = resp[0];
      console.log(resp)
    });
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

}
