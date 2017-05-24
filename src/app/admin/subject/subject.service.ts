import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import {HOST} from '../../constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Subject} from './subject.component';

@Injectable()
export class SubjectService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getSubjects() {
    return this.http.get('http://' + HOST + '/Subject/getRecords')
      .map((response: Response) => response.json());
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

  delete(subject_id: number): Promise<void> {
    return this.http
      .delete('http://' + HOST + '/Subject/del/' + subject_id, {headers: this.headers})
      .toPromise()
      .then(() => null);
  }
  getPagenationSubjects(page: number, limit: number) {
    let offset: number;
    offset = (page - 1) * 3;
    return this.http.get('http://' + HOST + '/Subject/getRecordsRange/' + limit + '/' + offset)
      .map((response: Response) => response.json());
  }
  getNumberOfRecords(){
    return this.http.get('http://' + HOST + '/Subject/countRecords/')
      .map((response: Response) => response.json());
  }
}





