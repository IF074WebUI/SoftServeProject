import { Injectable } from '@angular/core';
import {Http, } from '@angular/http';


import {HOST} from '../../constants';


@Injectable()
export class GroupService {

  constructor(private http: Http) { }

  getGroups() {
    return this.http.get('http://' + HOST + '/group/getRecords');
  }
}
