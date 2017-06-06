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
    return this.http.get('http://' + HOST + ENTITY + '/getTestDetailsByTest' + testId)
      .map((resp: Response) => resp.json());
  }



}
