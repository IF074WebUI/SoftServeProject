import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';

@Injectable()
export class GetRecordsRangeService {

  constructor(private http: Http) {}

  getRecordsRange(entity, limit, offset) {
    return this.http.get('http://' + HOST + '/' + entity + '/getRecordsRange/' + limit + '/' + offset).map(resp => resp.json());
  }

}
