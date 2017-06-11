import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HOST } from '../../constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SubjectService {

  constructor(private http: Http) {
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
}
