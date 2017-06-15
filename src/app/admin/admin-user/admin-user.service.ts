import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import { AdminUser } from './admin-user';
import 'rxjs/add/operator/map';

@Injectable()
export class AdminUserService {

  constructor(private http: Http) { }

  getCount(): Observable<number> {
    return this.http.get('http://' + HOST + '/AdminUser/countRecords').map((resp: Response) => resp.json()['numberOfRecords']);
  }

  getPaginated(limit: number, offset: number): Observable<AdminUser[]> {
    return this.http.get('http://' + HOST + '/AdminUser/getRecordsRange/' + limit + '/' + offset).map((resp: Response) => resp.json());
  }

  del(user_id: number): Observable<AdminUser> {
    return this.http.delete('http://' + HOST + '/AdminUser/del/' + user_id).map(resp => resp.json());
  }

  insert(AdminUser): Observable<AdminUser> {
    let body = {
      'username': AdminUser.username,
      'password': AdminUser.password,
      'password_confirm': AdminUser.password_confirm,
      'email': AdminUser.email
    };
    return this.http.post('http://' + HOST + '/AdminUser/insertData', body).map(resp => resp.json());
  }

  update(id, username, email): Observable<AdminUser> {
    let body = {
      'username': username,
      'email': email
    };
    return this.http.post('http://' + HOST + '/AdminUser/update/' + id, body).map(resp => resp.json());
  }

}
