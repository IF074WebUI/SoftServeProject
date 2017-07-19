import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LOGIN_URI } from '../constants';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(private http: Http) {
  }

  login(name: string, password: string): Observable<Response> {
    let body = JSON.stringify({'username': name, 'password': password})
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(`${LOGIN_URI}index`, body, options).map(resp => resp.json());
  }

  logout(): Observable<Response> {
    return this.http.get(`${LOGIN_URI}logout`).map(resp => resp.json());
  }

  checkLogged(): Observable<Response> {
    return this.http.get(`${LOGIN_URI}isLogged`).map(resp => resp.json());
  }

}
