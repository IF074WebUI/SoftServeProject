import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {TimetableService} from "../timetable/timetable.service";
import {TestsService} from "../services/tests.service";
import {DeleteRecordByIdService} from "../services/delete-record-by-id.service";

@Injectable()
export class SubjectService {
  constructor(private http: Http, private timetablesService: TimetableService, private testsService: TestsService,
              private delRecService: DeleteRecordByIdService) {
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
    return this.http.post('http://' + HOST + '/subject/update/' + updatedSubject.subject_id, bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }

  deleteCascade(id: number): Observable<any> {
    let delTestsTimetablesObs = [];
    return Observable.forkJoin(this.timetablesService.getTimeTablesForGroup(id), this.testsService.getTestsBySubject(id))
      .flatMap(resp => {
        if (resp[0]['response'] === 'no records' && resp[1]['response'] === 'no records') {
          return Observable.forkJoin(Observable.of(1));
        } else {
          for (let timetable of resp[0]) {
            delTestsTimetablesObs.push(this.delRecService.deleteRecordsById('timeTable', timetable.timetable_id));
          }
          for (let test of resp[1]) {
            delTestsTimetablesObs.push(this.testsService.deleteCascade(test.test_id));
          }
          return Observable.forkJoin(...delTestsTimetablesObs);
        }
      }).flatMap(arr => {
        return this.delRecService.deleteRecordsById('subject', id);
      });
  }
}
