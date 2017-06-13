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

  getStudentById(id: number): Observable<Student> {
    return this.http.get('http://' + HOST + '/student/getRecords/' + id).map(resp => resp.json());
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

  getAdminUser(user_id: number) {
    return this.http.get('http://' + HOST + '/AdminUser/getRecords/' + user_id).map(resp => resp.json());
    }

  insert(studentForm, studentData): Observable<Student> {
    let body = JSON.stringify(
      {
        'username': studentData.username,
        'password': studentData.password,
        'password_confirm': studentData.password_confirm,
        'email': studentForm.email,
        'gradebook_id': studentForm.gradebook,
        'student_surname': studentForm.student_surname,
        'student_name': studentForm.student_name,
        'student_fname': studentForm.student_fname,
        'group_id': studentForm.group,
        'plain_password': studentData.plain_password,
        'photo': studentData.photo
      }
    );
    return this.http.post('http://' + HOST + '/Student/insertData', body).map(resp => resp.json());
  }

  update(studentEditForm, studentEditData): Observable<Student> {
    let body = JSON.stringify(
      {
        'user_id': studentEditForm.user_id,
        'username': studentEditData.username,
        'password': studentEditData.password,
        'password_confirm': studentEditData.password_confirm,
        'email': studentEditForm.email,
        'gradebook_id': studentEditForm.gradebook,
        'student_surname': studentEditForm.student_surname,
        'student_name': studentEditForm.student_name,
        'student_fname': studentEditForm.student_fname,
        'group_id': studentEditForm.group,
        'plain_password': studentEditData.plain_password,
        'photo': studentEditData.photo,
      }
    );
    return this.http.post('http://' + HOST + '/Student/update/' + studentEditForm.user_id, body).map(resp => resp.json());
  }

  delete(user_id: number): Observable<Student> {
    return this.http.delete('http://' + HOST + '/Student/del/' + user_id).map(resp => resp.json());
  }
}
