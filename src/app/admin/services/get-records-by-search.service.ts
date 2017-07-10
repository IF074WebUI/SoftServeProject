import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';

@Injectable()
export class GetRecordsBySearchService {

  constructor(private http: Http) {}

  getRecordsBySearch(entity, searchCriteria: string) {
    return this.http.get('http://' + HOST + '/' + entity + '/getRecordsBySearch/' + searchCriteria).map((resp) => resp.json());
  }
}
