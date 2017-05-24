import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TimetableService {

  constructor(private http: Http) {}

  getTimeTablesForGroup(group_id) {
    return this.http.get('http://' + HOST + '/timeTable/getTimeTablesForGroup/' + group_id).map(resp => resp.json());
  }
  getTimeTablesForSubject(subject_id) {
    return this.http.get('http://' + HOST + '/timeTable/getTimeTablesForSubject/' + subject_id).map(resp => resp.json());
  }

  createTimeTable(groupId: number,
                  subjectId: number,
                  startDate: string,
                  startTime: string,
                  endDate: string,
                  endTime: string): Observable<Response> {
    const bodyForSendingNewTimeTable = JSON.stringify({
      group_id: groupId,
      subject_id: subjectId,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime
    });
    return this.http.post('http://' + HOST + '/timeTable/insertData', bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }
  updateTimeTable(timetable_id: number,
                  groupId: number,
                  subjectId: number,
                  startDate: string,
                  startTime: string,
                  endDate: string,
                  endTime: string): Observable<Response> {
    const bodyForSendingNewTimeTable = JSON.stringify({
      group_id: groupId,
      subject_id: subjectId,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime
    });
    return this.http.post('http://' + HOST + '/timeTable/update/' + timetable_id, bodyForSendingNewTimeTable)
      .map((resp: Response) => resp.json());
  }


}
