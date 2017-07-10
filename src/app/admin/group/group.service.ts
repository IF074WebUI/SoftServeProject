import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {HOST, INSERT_DATA, DEL} from '../../constants';
import { Group } from './group';
import { GROUP_ENTITY } from './groupConstants';
import { StudentsService } from '../students/students.service';
import { TimetableService } from '../timetable/timetable.service';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';
import { HOST_PROTOCOL} from '../../constants';



@Injectable()
export class GroupService {
  groups: Group[] = [];

  constructor(private http: Http, private studentsService: StudentsService, private timetablesService: TimetableService,
  private delRecService: DeleteRecordByIdService) {
  }

  getGroups() {
    return this.http.get(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/getRecords')
      .map((resp: Response) => resp.json());
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/getRecords/' + id).map((resp: Response) => resp.json());
  }

  getPaginatedPage(pageNumber: number, offset: number) {
    return this.http.get(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/getRecordsRange/' + offset + '/' + (pageNumber - 1) * offset)
      .map((resp: Response) => resp.json());
  }

  getFaculties() {
    return this.http.get(HOST_PROTOCOL + HOST + '/Faculty/getRecords')
      .map((resp: Response) => resp.json());
  }

  getSpeciality() {
    return this.http.get(HOST_PROTOCOL + HOST + '/Speciality/getRecords')
      .map((resp: Response) => resp.json());
  }

  createCroup(groupname: string, specialytyId: number, facultyId: number): Observable<Response> {
    let bodyForSendingNewGroups = JSON.stringify({
      group_name: groupname,
      faculty_id: facultyId,
      speciality_id: specialytyId
    });
    return this.http.post(HOST_PROTOCOL + HOST + GROUP_ENTITY + INSERT_DATA, bodyForSendingNewGroups)
      .map((resp: Response) => resp.json());
  }

  deleteGroup(id: number) {
    return this.http.delete(HOST_PROTOCOL + HOST + GROUP_ENTITY + DEL + id)
      .map((resp: Response) => resp.json());
  }

  deleteCascade(id: number): Observable<any> {
    let delStudentsTimetablesObs = [];
    return Observable.forkJoin(this.timetablesService.getTimeTablesForGroup(id), this.studentsService.getStudentsByGroupId(id))
      .flatMap(resp => {
        if (resp[0]['response'] === 'no records' && resp[1]['response'] === 'no records') {
          return Observable.forkJoin(Observable.of(1));
        } else {
          for (let timetable of resp[0]) {
            delStudentsTimetablesObs.push(this.delRecService.deleteRecordsById('timeTable', timetable.timetable_id));
          }
          for (let student of resp[1]) {
            delStudentsTimetablesObs.push(this.studentsService.deleteCascade(student.user_id));
          }
          return Observable.forkJoin(...delStudentsTimetablesObs);
        }
      }).flatMap(arr => {
        return this.deleteGroup(id);
      });
  }

  editGroup(id: number, groupname: string, specialytyId: number, facultyId: number) {
    let bodyForSendingEditedGroups = JSON.stringify({
      group_name: groupname,
      faculty_id: facultyId,
      speciality_id: specialytyId
    });
    return this.http.post(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/update/' + id, bodyForSendingEditedGroups)
      .map((resp) => resp.json());
  }

  getCountGroups() {
    return this.http.get(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/countRecords')
      .map((resp: Response) => resp.json()['numberOfRecords']);
  }

  getGroupsBySpeciality(specialytyId: number): Observable < [Group] > {
    return this.http.get(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/getGroupsBySpeciality/' + specialytyId)
      .map((resp: Response) => resp.json());
  }

  getGroupsByFaculty(facultyId: number) {
    return this.http.get(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/getGroupsByFaculty/' + facultyId)
      .map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable < Group[] > {
    return this.http.get(HOST_PROTOCOL + HOST + GROUP_ENTITY + '/getRecordsBySearch/' + criteria).map((resp: Response) => resp.json());
  }
}
