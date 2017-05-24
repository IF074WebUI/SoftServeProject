import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HOST} from '../../constants';

@Injectable()
export class DeleteRecordByIdService {

  constructor(private http: Http) {}

  deleteRecordsById(entity: string, id: number) {
    return this.http.get('http://' + HOST + '/' + entity + '/del/' + id).map(resp => resp.json());
  }

}
