import {Component, OnInit} from '@angular/core';
import {TestPlayerService} from './test-player.service';
import {GetTestsBySubjectService} from '../../admin/services/get-tests-by-subject.service';
import {Answer} from '../../admin/answers/answer';
import {Observable} from 'rxjs/Observable';
import {TestDetail} from '../../admin/test-detail/testDetail';
import 'rxjs/add/observable/of';


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
  providers: [GetTestsBySubjectService]
})
export class TestPlayerComponent implements OnInit {
  test_id: number;
  test: Object;
  questions: Question[] = [];
  question: Question;
  start: boolean;
  disable: boolean;
  i: number = 0 ;
  test_details: TestDetail[] = [];

  NEXT_QUESTION = 'Наступне питання';
  PREV_QUESTION = 'Попереднє питання';

  constructor(private test_player: TestPlayerService) {
  }

  ngOnInit() {
    this.test_id = 1;
    this.getTestDetails();
  }

  getTestDetails(){
    this.test_player.getTestDetail(this.test_id).subscribe(resp => {this.test_details = resp;
   });
  }


  startTest() {
    this.start = true;
    this.test_player.getQuestions(this.test_details).subscribe(resp => {this.questions = resp;
    console.log(resp)});
   }


}
