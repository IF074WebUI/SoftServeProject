import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs';

@Injectable()
export class QuestionsService {

  constructor(private http: Http) {}

  getQuestionById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/question/getRecords/' + id).map(resp => resp.json());
  }

}
