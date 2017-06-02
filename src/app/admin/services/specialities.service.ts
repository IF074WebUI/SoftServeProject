import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Speciality } from '../specialities/speciality';
import {SPECIALITY_URI} from '../../constants';

@Injectable()
export class SpecialitiesService {

  options: RequestOptions;


  constructor(private http: Http) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getAll(): Observable<Speciality[]> {
    return this.http.get(`${SPECIALITY_URI}getRecords`).map((resp: Response) => resp.json());
  }

  getPaginated(limit: number, offset: number): Observable<Speciality[]> {
  return this.http.get(`${SPECIALITY_URI}getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json());
  }

  searchByName(criteria: string): Observable<Speciality[]> {
    return this.http.get(`${SPECIALITY_URI}getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json());
  }

  getCount(): Observable<number> {
    return this.http.get(`${SPECIALITY_URI}countRecords`).map((resp: Response) => resp.json()['numberOfRecords']);
  }

  delete(id: number): Observable<Speciality> {
    return this.http.delete(`${SPECIALITY_URI}del/${id}`).map((resp: Response) => resp.json());
  }

  edit(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`${SPECIALITY_URI}update/${speciality['speciality_id']}`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json());
  }

  save(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`${SPECIALITY_URI}insertData`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json());
  }
}
