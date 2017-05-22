import { Injectable } from '@angular/core';
import {Http } from '@angular/http';
import {HOST} from '../../constants';

@Injectable()
export class TimetableService {

  constructor(private http: Http) {}

  getTimeTablesForGroup(group_id) {
    return this.http.get('http://' + HOST + '/timeTable/getTimeTablesForGroup/' + group_id).map(resp => resp.json());
  }
  getTimeTablesForSubject(subject_id) {
    return this.http.get('http://' + HOST + '/timeTable/getTimeTablesForSubject/' + subject_id).map(resp => resp.json());
  }

  getAllTimeTables() {
    return this.http.get('http://' + HOST + '/timeTable/getRecords/').map(resp => resp.json());
  }


}
