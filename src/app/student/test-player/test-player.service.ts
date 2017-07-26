import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response, Headers} from '@angular/http';
import {InitialRezults} from '../classes';
import {Answer} from '../../admin/answers/answer';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Student} from '../../admin/students/student';
import {TestPlayerData} from '../student-profile/TestPlayerData';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import {
  HOST, HOST_PROTOCOL, TEST_PLAYER_GET_ANSWER_BY_QUESTION, TEST_PLAYER_GET_DATA,
  TEST_PLAYER_GET_TEST_DETAILS_BY_TEST,
  TEST_PLAYER_GET_TIME_STAMP, TEST_PLAYER_RESET_SESSION_DATA, TEST_PLAYER_SANSWER, TEST_PLAYER_SAVE_DATA,
  TEST_PLAYER_START_TEST, TEST_PLAYER_CHECK_ANSWERS, TEST_PLAYER_GET_QUESTIONS_IDS_BY_LEVEL_RAND,
  TEST_PLAYER_GET_QUESTION_BY_ID, TEST_PLAYER_GET_ANSWER_BY_ID
} from '../../constants';

@Injectable()
export class TestPlayerService {
  questions: Array<number> = [];
  answers: Answer[] = [];
  options: RequestOptions;
  public testPlayerIdData = new BehaviorSubject<TestPlayerData>(new TestPlayerData);
  private studentData = new BehaviorSubject<Student>(new Student);
  private testRezults = new BehaviorSubject<InitialRezults>(new InitialRezults(0, 0, 0, 0, NaN));

  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }


  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  sendRezults(rezults: InitialRezults) {
    this.testRezults.next(rezults);
  }

  getRezults(): Observable<any> {
    return this.testRezults.asObservable();
  }
  setStudentData(data: Student) {
    this.studentData.next(data);
  }
  getStudentData() {
    return this.studentData.asObservable();
  }

  getCurrentTime() {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_TIME_STAMP)
      .map(resp => resp.json()).catch(this.handleError);
  }

  getQuestionsIdsByLevelRandom(test_id: number, level: number, number: number) {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_QUESTIONS_IDS_BY_LEVEL_RAND + test_id + '/'
      + level + '/' + number).map(resp => resp.json()).catch(this.handleError);
  }

  getTestDetail(test_id: number) {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_TEST_DETAILS_BY_TEST + test_id).map(resp => resp.json())
      .catch(this.handleError);
  }

  getAnswersById(id: number): Observable<any> {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_ANSWER_BY_ID + id).map(resp => resp.json()).catch(this.handleError);
  }

  getQuestions(testDetails: any[]) {
    let forkJoinBatch: Observable<any>[] = testDetails.map(item => {
      return this.getQuestionsIdsByLevelRandom(item.test_id, item.level, item.tasks);
    });
    return Observable.forkJoin(forkJoinBatch);
  };

  getQuestionById(id: number){
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_QUESTION_BY_ID + id).map(resp => resp.json()).catch(this.handleError);
  }

  resetSessionData() {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_RESET_SESSION_DATA).map(resp => resp.json()).catch(this.handleError);
  }

  checkSecurity(user_id: number, test_id: number) {
    let body = JSON.stringify({'user_id': user_id, 'test_id': test_id});
    return this.http.post(HOST_PROTOCOL + HOST + TEST_PLAYER_START_TEST + user_id + '/' + test_id, JSON.stringify(body), this.options).map(resp => resp.json()).catch(this.handleError)
  }

  saveData(allAnswers: any) {
    let body = JSON.stringify(allAnswers);
    return this.http.post(HOST_PROTOCOL + HOST + TEST_PLAYER_SAVE_DATA, JSON.stringify(body), this.options).map(resp => resp.json()).catch(this.handleError);
  }

  getData() {
    return this.http.get(HOST_PROTOCOL + HOST + TEST_PLAYER_GET_DATA).map(resp => resp.json()).catch(this.handleError);
  }

  checkResults(allAnswers: any) {
    return this.http.post(HOST_PROTOCOL + HOST + TEST_PLAYER_CHECK_ANSWERS, allAnswers, this.options).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  addIdData(data: TestPlayerData) {
    this.testPlayerIdData.next(data);
  }

  getLogs(userId: number): Observable<any> {
    return this.http.get(HOST_PROTOCOL + HOST + '/Log/getLogsByUser/' + userId)
      .map((resp: Response) => resp.json())
      .catch(this.handleError);
  }

  saveEndTime(endTime: number, testId: number, testDuration: number, testName: string) {
    let body = JSON.stringify({'endTime': endTime, 'testId': testId, 'testDuration': testDuration, testName: testName});
    return this.http.post(HOST_PROTOCOL + HOST + '/TestPlayer/saveEndTime', JSON.stringify(body))
      .map((resp: Response) => resp.json())
      .catch(this.handleError);
  }
  getEndTime() {
    return this.http.get(HOST_PROTOCOL + HOST + '/TestPlayer/getEndTime')
      .map((resp: Response) => resp.json())
      .catch(this.handleError);
  }
}


