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
  private entity = '/Group';
  groups: Group[] = [];
  constructor(private http: Http) { }



  getGroups() {
    return this.http.get('http://' + HOST + this.entity + '/getRecords')
      .map((resp: Response) => resp.json());
  }

  getPaginatedPage(pageNumber: number, numbersOfRecordOnPpage: number) {
    return this.http.get('http://' + HOST + this.entity + '/getRecordsRange/' + numbersOfRecordOnPpage + '/' + (pageNumber - 1) * numbersOfRecordOnPpage )
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
  createCroup(groupname: string, specialytyId: number, facultyId: number ): Observable<Response> {
    const bodyForSendingNewGroups = JSON.stringify({group_name: groupname, faculty_id: facultyId, speciality_id: specialytyId});
    return this.http.post('http://' + HOST + this.entity + '/insertData', bodyForSendingNewGroups)
      .map((resp: Response) => resp.json());
  }
  deleteGroup(id: number) {
   return this.http.delete('http://' + HOST + this.entity + '/del/' + id)
     .map((resp: Response) => resp.json());
  }

  editGroup(id: number, groupname: string, specialytyId: number, facultyId: number ) {
    const bodyForSendingEditedGroups = JSON.stringify({group_name: groupname, faculty_id: facultyId, speciality_id: specialytyId});
    return this.http.post('http://' + HOST + this.entity + '/update/' + id, bodyForSendingEditedGroups)
      .map((resp) => resp.json());
  }

  getGroupsBySpeciality(specialytyId: number) {
    return this.http.get('http://' + HOST + this.entity + '/getGroupsBySpeciality/' + specialytyId)
      .map((resp: Response) => resp.json());
  }

  getGroupsByFaculty(specialytyId: number) {
    return this.http.get('http://' + HOST + this.entity + '/getGroupsByFaculty/' + specialytyId)
      .map((resp: Response) => resp.json());
  }
  deleteGroupsBySpesialytyId(specialityId: number) {
    this.getGroupsBySpeciality(specialityId)
      .subscribe((data) =>  { this.groups = <Group[]> data; });
      for (let i = 0; i < this.groups.length; i++ ) {
       this.deleteGroup(this.groups[i].group_id)
          .subscribe((resp) => console.log(resp));
      }
  }

}
