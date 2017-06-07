import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { HOST } from '../../constants';
import { ENTITY } from './testDetailConsntants';
import { TestDetail } from './testDetail';

@Injectable()
export class TestDetailService {
  testDetails: TestDetail[] = [];
  constructor(private http: Http) { }

  getTestDetails(testId: number) {
    return this.http.get('http://' + HOST + ENTITY + '/getTestDetailsByTest/' + testId)
      .map((resp: Response) => resp.json());
  }

  createTestDetail(testId: number, level: number, tasks: number, rate: number ): Observable<Response> {
    const bodyForSendingTestDetails = JSON.stringify({test_id: testId, level: level, tasks: tasks, rate: rate});
    return this.http.post('http://' + HOST + ENTITY + '/insertData', bodyForSendingTestDetails)
      .map((resp: Response) => resp.json());
  }
  deleteGroup(id: number) {
    return this.http.delete('http://' + HOST + ENTITY + '/del/' + id)
      .map((resp: Response) => resp.json());
  }
  editTestDetail(id: number, testId: number, level: number, tasks: number, rate: number) {
    const bodyForSendingEditedGroups = JSON.stringify({test_id: testId, level: level, tasks: tasks, rate: rate});
    return this.http.post('http://' + HOST + ENTITY + '/update/' + id, bodyForSendingEditedGroups)
      .map((resp) => resp.json());
  }
}
