import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';

@Injectable()
export class GetRecordsBySearchService {

  constructor(private http: Http) {}

  getRecordsBySearch(entity, search_criteria_string) {
    return this.http.get('http://' + HOST + '/' + entity + '/getRecordsBySearch/' + search_criteria_string).map(resp => resp.json());
  }

}
