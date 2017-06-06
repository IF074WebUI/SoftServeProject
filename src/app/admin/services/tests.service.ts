import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HOST} from '../../constants';
import 'rxjs/add/operator/map';

@Injectable()
export class TestsService {
  constructor(private http: Http) {}

  getTestById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/test/getRecords/' + id).map(resp => resp.json());
  }

  getAll(): Observable<any> {
    return this.http.get('http://' + HOST + '/test/getRecords'  ).map(resp => resp.json());
  }

  createTest(newTest): Observable<Response> {
    const bodyForSendingNewTest = JSON.stringify({
      test_name: newTest.test_name,
      tasks: newTest.tasks,
      time_for_test: newTest.time_for_test,
      enabled: newTest.enabled,
      attempts: newTest.attempts,
      subject_id: newTest.subject_id
    });
    return this.http.post('http://' + HOST + '/test/insertData', bodyForSendingNewTest)
      .map((resp) => resp.json());
  }
  updateTest(updateTest, updateTestId): Observable<Response> {
    const bodyForSendingUpdateTest = JSON.stringify({
      test_name: updateTest.test_name,
      tasks: updateTest.tasks,
      time_for_test: updateTest.time_for_test,
      enabled: updateTest.enabled,
      attempts: updateTest.attempts,
      subject_id: updateTest.subject_id
    });
    return this.http.post('http://' + HOST + '/test/update/' + updateTestId, bodyForSendingUpdateTest)
      .map((resp) => resp.json());
  }
}
