import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  login(user): Observable<Response> {
    return this.http.post('http://dtapi.local/login', JSON.stringify({'username': 'admin', 'password': 'dtapi_admin'}))
      .map(resp => resp.json());
  }

  logout(): Observable<Response> {
    return this.http.get('http://dtapi.local/login/logout').map(resp => resp.json());
  }
}
