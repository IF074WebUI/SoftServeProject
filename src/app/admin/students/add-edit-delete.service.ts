import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { HOST } from '../../constants';

@Injectable()
export class AddEditDeleteService {

  constructor(private http: Http) {
  }

  insert(username: string,
         password: string,
         password_confirm: string,
         email: string,
         gradebook_id: string,
         student_surname: string,
         student_name: string,
         student_fname: string,
         group_id: number,
         plain_password: string,
         photo: any
  ): Observable<Response> {
    let body = JSON.stringify(
      {
        'username': username,
        'password': password,
        'password_confirm': password_confirm,
        'email': email,
        'gradebook_id': gradebook_id,
        'student_surname': student_surname,
        'student_name': student_name,
        'student_fname': student_fname,
        'group_id': group_id,
        'plain_password': plain_password,
        'photo': photo
      }
      );
    return this.http.post('http://' + HOST + '/Student/insertData', body).map(resp => resp.json());
  }

  update(username: string,
         password: string,
         password_confirm: string,
         email: string,
         gradebook_id: string,
         student_surname: string,
         student_name: string,
         student_fname: string,
         group_id: number,
         plain_password: string,
         photo: any,
         user_id: number
  ): Observable<Response> {
    let body = JSON.stringify(
      {
        'username': username,
        'password': password,
        'password_confirm': password_confirm,
        'email': email,
        'gradebook_id': gradebook_id,
        'student_surname': student_surname,
        'student_name': student_name,
        'student_fname': student_fname,
        'group_id': group_id,
        'plain_password': plain_password,
        'photo': photo
      }
    );
    return this.http.post('http://' + HOST + '/Student/update/' + user_id, body).map(resp => resp.json());
  }

  delete(user_id: number) {
    return this.http.delete('http://' + HOST + '/Student/del/' + user_id).map(resp => resp.json());
  }
}
