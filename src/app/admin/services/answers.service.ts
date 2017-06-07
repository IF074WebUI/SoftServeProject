import {HOST} from "../../constants";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AnswersService {

  constructor(private http: Http) {}

  getAnswersById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/answer/getRecords/' + id).map(resp => resp.json());
  }

}
