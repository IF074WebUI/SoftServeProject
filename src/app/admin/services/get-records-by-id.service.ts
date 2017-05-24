import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST } from '../../constants';

@Injectable()
export class GetRecordsByIdService {

  constructor(private http: Http) {}

  getRecordsById(entity, id) {
    return this.http.get('http://' + HOST + '/' + entity + '/getRecords/' + id).map(resp => resp.json());
  }
}

