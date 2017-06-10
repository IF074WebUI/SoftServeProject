import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Timetable } from '../timetable/timetable';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';
import {Subject} from "./subject";

@Injectable()
export class SubjectService {
  constructor(private http: Http,
              private getAllRecordsService: GetAllRecordsService,
              private deleteRecordByIdService: DeleteRecordByIdService) {
  }

  createSubject(newSubject): Observable<Response> {
    const bodyForSendingNewTimeTable = JSON.stringify({
      subject_description: newSubject.subject_description,
      subject_name: newSubject.subject_name
    });
    return this.http.post('http://' + HOST + '/subject/insertData', bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }
  updateSubject(updatedSubject): Observable<Response> {
    const bodyForSendingNewTimeTable = JSON.stringify({
      subject_description: updatedSubject.subject_description,
      subject_name: updatedSubject.subject_name
    });
    return this.http.post('http://' + HOST + '/timeTable/update/' + updatedSubject.subject_id, bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }
  deleteSubject(deletedSubject) {
    return this.getAllRecordsService.getAllRecords('timeTable').subscribe((data) => {
     const timetables: Timetable[] = data;
     for (const timetable of timetables ){
       if (timetable.subject_id === deletedSubject.subject_id) {
         this.deleteRecordByIdService.deleteRecordsById('timeTable', timetable.timetable_id);
       }
     }
     this.deleteRecordByIdService.deleteRecordsById('subject', deletedSubject.subject_id);
    });
  }
}
