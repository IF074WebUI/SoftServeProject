import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';


import {HOST} from '../../constants';
import {Group} from './group';


@Injectable()
export class GroupService {
  private entity: string = '/Group';
  constructor(private http: Http) { }

  getGroups() {
    return this.http.get('http://' + HOST + this.entity + '/getRecords')
      .map((data: Response) => data.json());
  }

  addGroup() {
    return this.http.post('http://' + HOST + this.entity + '/insertData')
      .map((data) => data.json());
  }
   // private extractData (res: Response) {
   //  return res.json();
  // }

}
