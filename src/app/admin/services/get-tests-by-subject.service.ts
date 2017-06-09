import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';

@Injectable()
export class GetTestsBySubjectService {

  constructor(private http: Http) {}
  getTestsBySubject(subject_id) {
    return this.http.get('http://' + HOST + '/test/getTestsBySubject/' + subject_id).map(resp => resp.json());
  }
}
