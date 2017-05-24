import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Speciality } from '../specialities/speciality';
import { HOST } from '../../constants';

@Injectable()
export class SpecialitiesService {

  options: RequestOptions;

  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getAll(): Observable<Speciality[]> {
    return this.http.get(`http://${HOST}/speciality/getRecords`).map((resp: Response) => resp.json());
  }

  getPaginated(limit: number, offset: number): Observable<Speciality[]> {
  return this.http.get(`http://${HOST}/speciality/getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable<Speciality[]> {
    return this.http.get(`http://${HOST}/speciality/getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json());
  }

  getCount(): Observable<number> {
    return this.http.get(`http://${HOST}/speciality/countRecords`).map((resp: Response) => resp.json()['numberOfRecords']);
  }

  delete(id: number): Observable<Speciality> {
    return this.http.delete(`http://${HOST}/speciality/del/${id}`).map((resp: Response) => resp.json());
  }

  edit(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`http://${HOST}/speciality/update/${speciality['speciality_id']}`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json());
  }

  save(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`http://${HOST}/speciality/insertData`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json());
  }
}
