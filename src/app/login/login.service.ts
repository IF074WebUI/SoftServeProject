import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {HOST} from '../constants';


@Injectable()
export class LoginService {

  constructor(private http: Http) {
  }

  login(name: string, password: string): Observable<Response> {
    let body = JSON.stringify({'username': name, 'password': password})
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('http://' + HOST + '/login/index', body, options).map(resp => resp.json());
  }

  logout(): Observable<Response> {
    return this.http.get('http://' + HOST + '/login/logout').map(resp => resp.json());
  }

  checkLogged(): Observable<Response> {
    return this.http.get('http://' + HOST + '/login/isLogged').map(resp => resp.json());
  }

}
