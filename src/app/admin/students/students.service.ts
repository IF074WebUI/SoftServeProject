import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import { Student } from './student';
import 'rxjs/add/operator/map';

@Injectable()
export class StudentsService {

  constructor(private http: Http) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get('http://' + HOST + '/student/getRecords').map(resp => resp.json());
  }
  getPaginated(limit: number, offset: number): Observable<Student[]> {
    return this.http.get('http://' + HOST + '/student/getRecordsRange/' + limit + '/' + offset).map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable<Student[]> {
    return this.http.get('http://' + HOST + '/student/getRecordsBySearch/' + criteria).map((resp: Response) => resp.json());
  }

  getCount(): Observable<number> {
    return this.http.get('http://' + HOST + '/student/countRecords').map((resp: Response) => resp.json()['numberOfRecords']);
  }

  getStudentsByGroupId(groupId: number) {
      return this.http.get('http://' + HOST + '/student/getStudentsByGroup/' +  groupId).map((resp: Response) => resp.json());
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
  ): Observable<Student> {
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
  ): Observable<Student> {
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

  delete(user_id: number): Observable<Student> {
    return this.http.delete('http://' + HOST + '/Student/del/' + user_id).map(resp => resp.json());
  }
}
