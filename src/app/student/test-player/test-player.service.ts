import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response, Headers} from '@angular/http';
import {
  HOST, TEST_PLAYER_GET_ANSWER_BY_QUESTION, TEST_PLAYER_GET_QUESTIONS_BY_LEVEL_RAND,
  TEST_PLAYER_GET_TEST_DETAILS_BY_TEST,
  TEST_PLAYER_GET_TIME_STAMP, TEST_PLAYER_SANSWER
} from '../../constants';
import {Question} from './test-player.component';
import {Answer} from '../../admin/answers/answer';


import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class TestPlayerService {
  questions: Question[] = [];
  answers: Answer[] = [];
  options: RequestOptions;

  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getCurrentTime() {
    return this.http.get('http://' + HOST + TEST_PLAYER_GET_TIME_STAMP).map(resp => resp.json());
  }

  getQuestionsByLevelRandom(test_id: number, level: number, number: number) {
    return this.http.get('http://' + HOST + TEST_PLAYER_GET_QUESTIONS_BY_LEVEL_RAND + test_id + '/' + level + '/' + number).map(resp => resp.json());
  }

  getTestDetail(test_id: number) {
    return this.http.get('http://' + HOST + TEST_PLAYER_GET_TEST_DETAILS_BY_TEST + test_id).map(resp => resp.json());
  }

  getAnswersById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + TEST_PLAYER_SANSWER + TEST_PLAYER_GET_ANSWER_BY_QUESTION + id).map(resp => resp.json());
  }

  getQuestions(testDetails: any[]) {
    this.questions = [];
    let forkJoinBatch: Observable<any>[] = testDetails.map(item => {
      return this.getQuestionsByLevelRandom(item.test_id, item.level, item.tasks);
    });
    return Observable.forkJoin(forkJoinBatch)
      .map((questions: Question[][] | any) => {
        this.questions = this.prepareQuestionForTest(<Question[][]>questions);
        return this.questions;
      });

  };

  prepareQuestionForTest(questions: Question[][]): Question[] {
    let tempArr: Question[] = [];

    questions.forEach((elem: Question[]) => {
      tempArr.push(...elem);
    });
    return tempArr.map((question: Question) => {
      return question;
    });
  }

  getAnswers(questions: Question[]) {
    let forkJoinBatch: Observable<any>[] = questions.filter(item => item['type'].toString() !== '3')
      .map(question => {
        return this.getAnswersById(question['question_id']);
      });

    return Observable.forkJoin(forkJoinBatch)
      .do((answers: Answer[][] | any) => {
        answers.map((answer, i) => {
          questions[i]['answers'] = answer;
        });
      });
  }

  checkSecurity(user_id: number, test_id: number) {
    let body = JSON.stringify({'user_id': user_id, 'test_id': test_id});
    return this.http.post('http://' + HOST + '/Log/startTest/' + user_id + '/' + test_id, JSON.stringify(body), this.options).map((resp: Response) => resp.json());
  }
}


