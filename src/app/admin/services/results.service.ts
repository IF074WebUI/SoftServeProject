import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Result } from '../results/result';
import { RESULT_URI } from '../../constants';
import { Router } from '@angular/router';

@Injectable()
export class ResultsService {

  options: RequestOptions;

  constructor(private http: Http, private router: Router) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getAll(): Observable<Result[]> {
    return this.http.get(`${RESULT_URI}getRecords`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

  getAllByStudent(studentId: number): Observable<Result[]> {
    return this.http.get(`${RESULT_URI}getRecordsbyStudent/${studentId}`)
      .map((resp: Response) => resp.json()).catch(this.handleError.bind(this));
  }

  countPassedByStudent(studentId: number, testId: number): Observable<number> {
    return this.http.get(`${RESULT_URI}countTestPassesByStudent/${studentId}}/${testId}`)
      .map((resp: Response) => resp.json()).catch(this.handleError.bind(this));
  }

  getAllByTestGroupDate(testId: number, groupId?: number, date?: Date): Observable<Result[]> {
    if (date && groupId) {
      return this.http.get(`${RESULT_URI}getRecordsByTestGroupDate/${testId}/${groupId}/${date}`)
        .map((resp: Response) => resp.json()).catch(this.handleError.bind(this));
    } else {
      return this.http.get(`${RESULT_URI}getRecordsByTestGroupDate/${testId}`)
        .map((resp: Response) => resp.json()).catch(this.handleError.bind(this));
    }
  }

  getPassedTestsByGroup(groupId: number) {
    return this.http.get(`${RESULT_URI}getResultTestIdsByGroup/${groupId}`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

  getPaginated(limit: number, offset: number): Observable<Result[]> {
    return this.http.get(`${RESULT_URI}getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

  searchByName(criteria: string): Observable<Result[]> {
    return this.http.get(`${RESULT_URI}getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

  getCount(): Observable<number> {
    return this.http.get(`${RESULT_URI}countRecords`).map((resp: Response) => resp.json()['numberOfRecords'])
      .catch(this.handleError.bind(this));
  }

  delete(id: number): Observable<Result> {
    return this.http.delete(`${RESULT_URI}del/${id}`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

  handleError (error: Response|any) {
    if (error.status === 400) {
      this.router.navigate(['/bad_request']);
    } else if (error.status === 403) {
      this.router.navigate(['/access_denied']);
    } else if (error.status === 404) {
      this.router.navigate(['/not_found']);
    }
    return Observable.throw(new Error(error));
  }

}
