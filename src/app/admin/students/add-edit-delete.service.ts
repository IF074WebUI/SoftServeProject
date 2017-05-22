import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { HOST } from '../../constants';

@Injectable()
export class AddEditDeleteService {

  constructor(private http: Http) {
  }

  insert(): Observable<Response> {
    let body = JSON.stringify();
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('http://' + HOST + '/student/insertData', body, options).map(resp => resp.json());
  }

  update(): Observable<Response> {
    let body = JSON.stringify();
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('http://' + HOST + '/student/update' + id, body, options).map(resp => resp.json());
  }

  delete(): Observable<Response> {
    return this.http.delete('http://' + HOST + '/del' + id).map(resp => resp.json());
  }

  countRecords() {
    return this.http.get('http://' + HOST + '/Student/countRecords').map(resp => resp.json());
  }
}
