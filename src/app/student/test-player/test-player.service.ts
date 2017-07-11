import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response, Headers} from '@angular/http';
import {
  HOST, HOST_PROTOCOL, TEST_PLAYER_GET_ANSWER_BY_QUESTION, TEST_PLAYER_GET_DATA,
  TEST_PLAYER_GET_QUESTIONS_BY_LEVEL_RAND,
  TEST_PLAYER_GET_TEST_DETAILS_BY_TEST,
  TEST_PLAYER_GET_TIME_STAMP, TEST_PLAYER_RESET_SESSION_DATA, TEST_PLAYER_SANSWER, TEST_PLAYER_SAVE_DATA,
  TEST_PLAYER_START_TEST, TEST_PLAYER_CHECK_ANSWERS
} from '../../constants';
import {Question} from './test-player.component';
import {Answer} from '../../admin/answers/answer';


import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import { Subject } from 'rxjs/Subject';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class TestPlayerService {
  questions: Question[] = [];
  answers: Answer[] = [];
  options: RequestOptions;
  public testPlayerIdData = new BehaviorSubject<any>({
    studentId: 0 ,
    testId: 0,
    testDuration: 0
  })

  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }



  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }


  getCurrentTime() {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_TIME_STAMP).map(resp => resp.json()).catch(this.handleError);
  }

  getQuestionsByLevelRandom(test_id: number, level: number, number: number) {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_QUESTIONS_BY_LEVEL_RAND + test_id + '/' + level + '/' + number).map(resp => resp.json()).catch(this.handleError);
  }

  getTestDetail(test_id: number) {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_TEST_DETAILS_BY_TEST + test_id).map(resp => resp.json()).catch(this.handleError);
  }

  getAnswersById(id: number): Observable<any> {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_SANSWER + TEST_PLAYER_GET_ANSWER_BY_QUESTION + id).map(resp => resp.json()).catch(this.handleError);
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
      }).catch(this.handleError);

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
    let forkJoinBatch: Observable<any>[] = questions.filter(item => item['type'] !== '3')
      .map(question => {
        return this.getAnswersById(question['question_id']);
      });

    return Observable.forkJoin(forkJoinBatch)
      .do((answers: Answer[][] | any) => {
        answers.map((answer, i) => {
          questions[i]['answers'] = answer;
        });
      }).catch(this.handleError);
  }

  resetSessionData(){
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_RESET_SESSION_DATA).map(resp => resp.json()).catch(this.handleError);
  }

  checkSecurity(user_id: number, test_id: number) {
    let body = JSON.stringify({'user_id': user_id, 'test_id': test_id});
    return this.http.post(HOST_PROTOCOL + HOST + TEST_PLAYER_START_TEST + user_id + '/' + test_id, JSON.stringify(body), this.options).map(resp => resp.json())
//      .catch(this.handleError);
  }

  saveData(allAnswers: any){
    let body = JSON.stringify(allAnswers);
    return this.http.post(HOST_PROTOCOL + HOST + TEST_PLAYER_SAVE_DATA, JSON.stringify(body), this.options).map(resp => resp.json()).catch(this.handleError);
  }

  getData() {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_DATA).map(resp => resp.json()).catch(this.handleError);
  }
  checkResults(allAnswers: any){
    // [{question_id: 10, answer_ids: [1,2,3,4]}, {question_id: 18, answer_ids:[10]}, ...]
return this.http.post(HOST_PROTOCOL + HOST + TEST_PLAYER_CHECK_ANSWERS, allAnswers,  this.options).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  addIdData(data: any) {
    this.testPlayerIdData.next(data);
  }
}


