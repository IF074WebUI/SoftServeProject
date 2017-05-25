import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import { Student } from './student';


@Injectable()
export class StudentsService {

  constructor(private http: Http) {}

  getAllStudents() {
    return this.http.get('http://' + HOST + '/student/getRecords/').map(resp => resp.json());
  }
  getPaginated(limit: number, offset: number): Observable<Student[]> {
    return this.http.get(`http://${HOST}/student/getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable<Student[]> {
    return this.http.get(`http://${HOST}/student/getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json());
  }

  getCount(): Observable<number> {
    return this.http.get(`http://${HOST}/student/countRecords`).map((resp: Response) => resp.json()['numberOfRecords']);
  }

  getStudentsByGroupId(groupId: number) {
      return this.http.get('http://' + HOST + '/student/getStudentsByGroup/' +  groupId).map((resp: Response) => resp.json());
    }

}
