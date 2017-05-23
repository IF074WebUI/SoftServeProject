import { Injectable } from '@angular/core';
import {Http } from '@angular/http';
import {HOST} from '../../constants';


@Injectable()
export class StudentsService {

  constructor(private http: Http) {}

  getAllStudents() {
    return this.http.get('http://' + HOST + '/student/getRecords/').map(resp => resp.json());
  }

}
