import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response} from '@angular/http';
import {ANSWER_URI, HOST} from '../../constants';
import {Observable} from 'rxjs/Observable';
import {Answer} from '../answers/answer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class AnswersService {

  answers: Answer[] = [];

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
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

  constructor(private http: Http, private router: Router,  private activatedRoute: ActivatedRoute) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
  }

  getAll(): Observable<Answer[]> {
    return this.http.get(`${ANSWER_URI}getRecords`).map((resp: Response) => resp.json());
  }
  getAnswersById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/answer/getRecords/' + id).map(resp => resp.json()).catch(this.handleError);
  }

  getAnswers() {
    return this.http.get('http://' + HOST + '/answer/getRecords')
      .map((resp: Response) => resp.json());
  }
  getAnswersByQuestion(question_id: number) {
    return this.http.get('http://' + HOST + '/question/getAnswersByQuestion' + question_id)
      .map((resp: Response) => resp.json());  }

  getPaginatedPage(pageNumber: number, recordsPerPage: number) {
    return this.http.get('http://' + HOST + '/answer/getRecordsRange/' + recordsPerPage + '/' + (pageNumber - 1) * recordsPerPage )
      .map((resp: Response) => resp.json());
  }
  createAnswer(answertext: string, questionId: number, trueanswer: string, attach: any ): Observable<Response> {
    const bodyForSendingNewAnswers = JSON.stringify({answer_text: answertext, question_id: questionId,
      true_answer: trueanswer, attachment: attach});
    return this.http.post('http://' + HOST + '/answer/insertData', bodyForSendingNewAnswers)
      .map((resp: Response) => resp.json());
  }
  deleteAnswer(answer_id: number) {
    return this.http.delete('http://' + HOST + '/answer/del/' + answer_id)
      .map((resp: Response) => resp.json());
  }
  editAnswer(answer_id: number, answertext: string, questionId: number, true_answer: string, attach: any) {
    const bodyForSendingEditedAnswers = JSON.stringify({answer_text: answertext, question_id: questionId,
      trueanswer: true_answer, attachment: attach});
    return this.http.post('http://' + HOST + '/answer/update/' + answer_id, bodyForSendingEditedAnswers)
      .map((resp) => resp.json());
  }
  getCountAnswers() {
    return this.http.get( 'http://' + HOST + '/answer/countRecords')
      .map((resp: Response) => resp.json()['numberOfRecords']);
  }
  searchByName(criteria: string): Observable<Answer[]> {
    return this.http.get('http://' + HOST + '/answer/getRecordsBySearch/' + criteria).map((resp: Response) => resp.json());
  }
}
