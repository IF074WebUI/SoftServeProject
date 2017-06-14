import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Answer } from '../answers/answer';
import {ANSWER_URI, HOST} from '../../constants';

@Injectable()
export class AnswersService {

  options: RequestOptions;


  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getAll(): Observable<Answer[]> {
    return this.http.get(`${ANSWER_URI}getRecords`).map((resp: Response) => resp.json());
  }
  getAnswersById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/answer/getRecords/' + id).map(resp => resp.json());
  }
  getPaginated(limit: number, offset: number): Observable<Answer[]> {
    return this.http.get(`${ANSWER_URI}getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable<Answer[]> {
    return this.http.get(`${ANSWER_URI}getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json());
  }

  getCount(): Observable<number> {
    return this.http.get(`${ANSWER_URI}countRecords`).map((resp: Response) => resp.json()['numberOfRecords']);
  }
  getAnswerByQuestion(question_id: number): Observable <any> {
    return this.http.get(`${ANSWER_URI}getAnswerByQuestion/${question_id}`)
      .map((resp: Response) => resp.json());
  }

  delete(id: number): Observable<Answer> {
    return this.http.delete(`${ANSWER_URI}del/${id}`).map((resp: Response) => resp.json());
  }

  edit(answer: Answer): Observable<Answer> {
    return this.http.post(`${ANSWER_URI}update/${answer['answer_id']}`, JSON.stringify(answer), this.options)
      .map((resp: Response) => resp.json());
  }

  save(answer: Answer): Observable<Answer> {
    return this.http.post(`${ANSWER_URI}insertData`, JSON.stringify(answer), this.options)
      .map((resp: Response) => resp.json());
  }
}
