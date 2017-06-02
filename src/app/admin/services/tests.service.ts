import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HOST} from "../../constants";

@Injectable()
export class TestsService {
  constructor(private http: Http) {}

  getTestById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/test/getRecords/' + id).map(resp => resp.json());
  }

  getAll(): Observable<any> {
    return this.http.get('http://' + HOST + '/test/getRecords'  ).map(resp => resp.json());
  }

}
