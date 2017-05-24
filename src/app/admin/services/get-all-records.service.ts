import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';

@Injectable()
export class GetAllRecordsService {

  constructor(private http: Http) {}

  getAllRecords(entity) {
    return this.http.get('http://' + HOST + '/' + entity + '/getRecords').map(resp => resp.json());
  }
}
