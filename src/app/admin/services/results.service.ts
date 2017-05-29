import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Result} from '../results/result';
import {RESULT_URI} from '../../constants';

@Injectable()
export class ResultsService {

  options: RequestOptions;

  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getAll(): Observable<Result[]> {
    return this.http.get(`${RESULT_URI}getRecords`).map((resp: Response) => resp.json());
  }

  getPaginated(limit: number, offset: number): Observable<Result[]> {
    return this.http.get(`${RESULT_URI}/getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable<Result[]> {
    return this.http.get(`${RESULT_URI}/getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json());
  }

  getCount(): Observable<number> {
    return this.http.get(`${RESULT_URI}/countRecords`).map((resp: Response) => resp.json()['numberOfRecords']);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete(`${RESULT_URI}/del/${id}`).map((resp: Response) => resp.json());
  }

  edit(speciality: Result): Observable<Result> {
    return this.http.post(`${RESULT_URI}/update/${speciality['speciality_id']}`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json());
  }

  save(speciality: Result): Observable<Result> {
    return this.http.post(`${RESULT_URI}/insertData`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json());
  }
}
