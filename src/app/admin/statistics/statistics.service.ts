import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';

@Injectable()
export class StatisticsService {
  constructor(private http: Http) {}

  getCountRecords(entity) {
    return this.http.get('http://' + HOST + '/' +  entity + '/countRecords').map(resp => resp.json());
  }

}
