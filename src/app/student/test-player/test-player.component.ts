import {Component, OnInit} from '@angular/core';
import {TestPlayerService} from './test-player.service';
import {ActivatedRoute} from '@angular/router';
import {Test} from '../../admin/tests/test';
import {GetTestsBySubjectService} from '../../admin/services/get-tests-by-subject.service';
import {Answer} from '../../admin/answers/answer';
import {TestDetail} from '../../admin/test-detail/testDetail';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

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
  testDuRation: number;
  test_id: number;
  test: Test;
  questions: Question[] = [];
  question: Question;
  start: boolean;
//  i: number;
  student_id: string;
  test_details: TestDetail[] = [];
  answers: Answer[];

  NEXT_QUESTION = 'Наступне питання';
  PREV_QUESTION = 'Попереднє питання';

  constructor(private test_player: TestPlayerService,  private route: ActivatedRoute) {
  //  this.i = 0;
  }

  ngOnInit() {
    this.test_id = this.route.snapshot.queryParams['testId'] || 1;
    this.student_id = this.route.snapshot.queryParams['user_id'];
    this.testDuRation = +this.route.snapshot.queryParams['test_duration'];
    console.log(this.testDuRation)
        this.getTestDetails();
  }
  getTestDetails() {
    this.test_player.getTestDetail(this.test_id).subscribe(resp => {
      this.test_details = resp;
    });
  }


  startTest() {
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


  timer () {

  }

}
