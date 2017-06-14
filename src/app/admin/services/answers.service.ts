import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Answer } from '../answers/answer';
import {ANSWER_URI, HOST} from '../../constants';

@Injectable()
export class AnswersService {

  options: RequestOptions;

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

  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getAll(): Observable<Answer[]> {
    return this.http.get(`${ANSWER_URI}getRecords`).map((resp: Response) => resp.json()).catch(this.handleError);
  }
  getAnswersById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/answer/getRecords/' + id).map(resp => resp.json()).catch(this.handleError);
  }
  getPaginated(limit: number, offset: number): Observable<Answer[]> {
    return this.http.get(`${ANSWER_URI}getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  searchByName(criteria: string): Observable<Answer[]> {
    return this.http.get(`${ANSWER_URI}getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  getCount(): Observable<number> {
    return this.http.get(`${ANSWER_URI}countRecords`).map((resp: Response) => resp.json()['numberOfRecords']).catch(this.handleError);
  }
  getAnswerByQuestion(question_id: number): Observable <any> {
    return this.http.get(`${ANSWER_URI}getAnswerByQuestion/${question_id}`)
      .map((resp: Response) => resp.json()).catch(this.handleError);
  }

  delete(id: number): Observable<Answer> {
    return this.http.delete(`${ANSWER_URI}del/${id}`).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  edit(answer: Answer): Observable<Answer> {
    return this.http.post(`${ANSWER_URI}update/${answer['answer_id']}`, JSON.stringify(answer), this.options)
      .map((resp: Response) => resp.json()).catch(this.handleError);
  }

  save(answer: Answer): Observable<Answer> {
    return this.http.post(`${ANSWER_URI}insertData`, JSON.stringify(answer), this.options)
      .map((resp: Response) => resp.json()).catch(this.handleError);
  }
}
