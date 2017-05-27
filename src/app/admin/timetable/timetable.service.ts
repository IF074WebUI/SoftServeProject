import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TimetableService {

  constructor(private http: Http) {}

  getTimeTablesForSubject(subject_id) {
    return this.http.get('http://' + HOST + '/timeTable/getTimeTablesForSubject/' + subject_id).map(resp => resp.json());
  }

  getTimeTablesForGroup(group_id) {
    return this.http.get('http://' + HOST + '/timeTable/getTimeTablesForGroup/' + group_id).map(resp => resp.json());
  }


  createTimeTable(newTimetable): Observable<Response> {
    const bodyForSendingNewTimeTable = JSON.stringify({
      group_id: newTimetable.group_id,
      subject_id: newTimetable.subject_id,
      start_date: newTimetable.start_date,
      start_time: newTimetable.start_time,
      end_date: newTimetable.end_date,
      end_time: newTimetable.end_time
    });
    return this.http.post('http://' + HOST + '/timeTable/insertData', bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }
  updateTimeTable(updatedTimetable): Observable<Response> {
    const bodyForSendingNewTimeTable = JSON.stringify({
      group_id: updatedTimetable.group_id,
      subject_id: updatedTimetable.subject_id,
      start_date: updatedTimetable.start_date,
      start_time: updatedTimetable.start_time,
      end_date: updatedTimetable.end_date,
      end_time: updatedTimetable.end_time
    });
    return this.http.post('http://' + HOST + '/timeTable/update/' + updatedTimetable.timetable_id, bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }


}
