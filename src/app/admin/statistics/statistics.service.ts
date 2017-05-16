import { Injectable } from '@angular/core';
import {Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HOST} from "../../constants";

@Injectable()
export class StatisticsService {

  constructor(private http: Http) {}

  countFacultyRecords():Observable<Response>{
    return this.http.get('http://' + HOST + '/faculty/countRecords').map(resp => resp.json());
  }

}
