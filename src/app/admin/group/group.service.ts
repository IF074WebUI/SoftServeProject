import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';


import {HOST} from '../../constants';
import {Group} from './group';


@Injectable()
export class GroupService {
  private entity: string = '/Group';
  constructor(private http: Http) { }

  getGroups() {
    return this.http.get('http://' + HOST + this.entity + '/getRecords')
      .map((resp: Response) => resp.json());
  }
  getFaculties() {
    return this.http.get('http://' + HOST + '/Faculty/getRecords')
      .map((resp: Response) => resp.json());
  }
  getSpeciality() {
    return this.http.get('http://' + HOST + '/Speciality/getRecords')
      .map((resp: Response) => resp.json());
  }
  //
  //  createGroup(group_name: string,
  //    faculty_id: string,
  //    speciality_id: string ): Observable<Response> { {
  //   let bodyForCreating = JSON.stringify('group_name': groupName, 'faculty_id': facultyId, 'speciality_id': specialityId);
  //   return.this.http.post('http://' + HOST + this.entity + '/insertData', bodyForCreating)
  //      .map((resp) => resp.json());
  //  }
  //
  //  // private extractData (res: Response) {
  //  //  return res.json();
  // // }
  //
}
