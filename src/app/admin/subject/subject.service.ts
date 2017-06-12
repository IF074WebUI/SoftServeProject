import {EventEmitter, Injectable, Output} from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Timetable } from '../timetable/timetable';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';

@Injectable()
export class SubjectService {
  @Output() emitGetRecordsEvent = new EventEmitter;
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
    this.getAllRecordsService.getAllRecords('timeTable').subscribe((timetablesResp) => {
     const timetables: Timetable[] = timetablesResp;
     for (const timetable of timetables ){
       if (timetable.subject_id === deletedSubject.subject_id) {
         this.deleteRecordByIdService.deleteRecordsById('timeTable', timetable.timetable_id)
           .subscribe((deleteTimetableResp) => console.log(deleteTimetableResp));
       }
     }
     this.deleteRecordByIdService.deleteRecordsById('subject', deletedSubject.subject_id)
       .subscribe((deleteSubjectResp) => {
         console.log(deleteSubjectResp);
         this.emitGetRecordsEvent.emit();
       });
    });
  }
  getRecordsEmitter() {
    return this.emitGetRecordsEvent;
  }
}
