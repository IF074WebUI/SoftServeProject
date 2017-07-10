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
      start_date: newTimetable.time_limits.start_date,
      start_time: newTimetable.time_limits.start_time,
      end_date: newTimetable.time_limits.end_date,
      end_time: newTimetable.time_limits.end_time
    });
    return this.http.post('http://' + HOST + '/timeTable/insertData', bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }
  updateTimeTable(updatedTimetable, updatedTimetable_id): Observable<Response> {
    const bodyForSendingNewTimeTable = JSON.stringify({
      group_id: updatedTimetable.group_id,
      subject_id: updatedTimetable.subject_id,
      start_date: updatedTimetable.time_limits.start_date,
      start_time: updatedTimetable.time_limits.start_time,
      end_date: updatedTimetable.time_limits.end_date,
      end_time: updatedTimetable.time_limits.end_time
    });
    return this.http.post('http://' + HOST + '/timeTable/update/' + updatedTimetable_id, bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }


}
