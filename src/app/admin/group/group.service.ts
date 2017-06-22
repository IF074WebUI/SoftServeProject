import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { HOST } from '../../constants';
import { Group } from './group';
import { GROUP_ENITY } from './groupConstants';
import { StudentsService } from '../students/students.service';
import { TimetableService } from '../timetable/timetable.service';
import { Student } from '../students/student';

@Injectable()
export class GroupService {
  groups: Group[] = [];
  constructor(private http: Http, private studentsService: StudentsService, private timetablesService: TimetableService) { }

  getGroups() {
    return this.http.get('http://' + HOST + GROUP_ENITY + '/getRecords')
      .map((resp: Response) => resp.json());
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get('http://' + HOST + GROUP_ENITY + '/getRecords/' + id).map((resp: Response) => resp.json());
  }

  getPaginatedPage(pageNumber: number, offset: number) {
    return this.http.get('http://' + HOST + GROUP_ENITY + '/getRecordsRange/' + offset + '/' + (pageNumber - 1) * offset )
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
    return this.http.post('http://' + HOST + GROUP_ENITY + '/insertData', bodyForSendingNewGroups)
      .map((resp: Response) => resp.json());
  }
  deleteGroup(id: number) {
   return this.http.delete('http://' + HOST + GROUP_ENITY + '/del/' + id)
     .map((resp: Response) => resp.json());
  }

  deleteCascade(id: number): Observable<any> {
    let delStudentsObs = [];
    return this.studentsService.getStudentsByGroupId(id).flatMap((students: Student[]) => {
      for (let student of students) {
        delStudentsObs.push(this.studentsService.deleteCascade(student.user_id));
      }
      return Observable.forkJoin(...delStudentsObs);
    }).flatMap(arr =>
        this.deleteGroup(id)
    );
  }

  editGroup(id: number, groupname: string, specialytyId: number, facultyId: number ) {
    const bodyForSendingEditedGroups = JSON.stringify({group_name: groupname, faculty_id: facultyId, speciality_id: specialytyId});
    return this.http.post('http://' + HOST + GROUP_ENITY + '/update/' + id, bodyForSendingEditedGroups)
      .map((resp) => resp.json());
  }

  getCountGroups() {
    return this.http.get( 'http://' + HOST + GROUP_ENITY + '/countRecords')
      .map((resp: Response) => resp.json()['numberOfRecords']);
  }
  getGroupsBySpeciality(specialytyId: number): Observable<[Group]> {
    return this.http.get('http://' + HOST + GROUP_ENITY + '/getGroupsBySpeciality/' + specialytyId)
      .map((resp: Response) => resp.json());
  }

  getGroupsByFaculty(facultyId: number) {
    return this.http.get('http://' + HOST + GROUP_ENITY + '/getGroupsByFaculty/' + facultyId)
      .map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable<Group[]> {
    return this.http.get('http://' + HOST + GROUP_ENITY + '/getRecordsBySearch/' + criteria).map((resp: Response) => resp.json());
  }
}
