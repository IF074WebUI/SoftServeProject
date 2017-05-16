import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import {HOST} from '../../constants';
import {Group} from './group';

@Injectable()
export class GroupService {

  constructor(private http: Http) { }

  getGroups():  Observable<Response> {
    return this.http.get('http://' + HOST + '/group/getRecords')
      .toPromise()
      .then(response => response.json().data as Group[])
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
