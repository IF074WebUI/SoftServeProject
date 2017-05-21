import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import {HOST} from '../../constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Subject} from './subject.component';

@Injectable()
export class SubjectService {
  constructor(private http: Http) {}

  private headers = new Headers({'Content-Type': 'application/json'});

  getSubjects() {
    return this.http.get('http://' + HOST + '/Subject/getRecords')
      .map((response: Response) => response.json());
      // .catch(this.handleError);
  }
  create(subject_name: string, subject_description: string): Promise<Subject> {
    return this.http
      .post('http://' + HOST + '/Subject/insertData',
        JSON.stringify({subject_name: subject_name, subject_description: subject_description}),
        {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Subject);
  }
  update(subject: Subject): Promise<Subject> {
    return this.http
      .post('http://' + HOST + '/Subject/update/' + subject.subject_id,
        JSON.stringify({subject_name: subject.subject_name, subject_description: subject.subject_description}),
        {headers: this.headers})
      .toPromise()
      .then(() => subject);
       }
}







