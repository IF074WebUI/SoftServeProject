import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HOST } from '../../constants';

@Injectable()
export class FacultyService {

  constructor(private http: Http) {
  }

  getAllFaculties() {
    return this.http.get('http://' + HOST + '/Faculty/getRecords').map((resp: Response) => resp.json());
  }

  countAllRecords() {
    return this.http.get('http://' + HOST + '/Faculty/countRecords').map((resp: Response) => resp.json());
  }

  getPaginatedPage(n: number) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsRange/10/' + (n - 1) * 10).map((resp: Response) => resp.json());
  }

  deleteItem(id: number) {
    return this.http.delete('http://' + HOST + '/Faculty/del/' + id).map((resp: Response) => resp.json());

  }

  editItem(id: number, name: string, description: string): Observable<Response> {
    let body = JSON.stringify({'faculty_name': name, 'faculty_description': description})
    return this.http.post('http://' + HOST + '/Faculty/update/' + id, body).map((resp: Response) => resp.json());
  }

  addItem(name: string, description: string): Observable<Response> {
    let body1 = JSON.stringify({'faculty_name': name, 'faculty_description': description})
    return this.http.post('http://' + HOST + '/Faculty/insertData', body1).map((resp: Response) => resp.json());
  }

  searchByName(name: string) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsBySearch/' + name).map((resp: Response) => resp.json());
  }

  getFacultyById(id: number) {
    return this.http.get('http://' + HOST + '/Faculty/getRecords/' + id).map((resp: Response) => resp.json());
  }
  getGroupsByFacultyId(id: number) {
    return this.http.get('http://' + HOST + '/group/getGroupsByFaculty/' + id).map((resp: Response) => resp.json());
  }


}

