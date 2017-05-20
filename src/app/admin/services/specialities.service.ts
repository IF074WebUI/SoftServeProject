import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Speciality} from "../specialities/speciality";
import {HOST} from "../../constants";

@Injectable()
export class SpecialitiesService {

  constructor(private http: Http) { }

  getAll(): Observable<Speciality[]> {
    return this.http.get(`http://${HOST}/speciality/getRecords`).map((resp: Response) => resp.json());
  }

  getPaginated(limit: number, offset: number): Observable<Speciality[]> {
  return this.http.get(`http://${HOST}/speciality/getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json());
  }

  getSearched(criteria: string): Observable<Speciality[]> {
    return this.http.get(`http://${HOST}/speciality/getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json());
  }



  getCount(): Observable<number> {
    return this.http.get(`http://${HOST}/speciality/countRecords`).map((resp: Response) => resp.json()['numberOfRecords']);
  }

  delete(id: number): Observable<Speciality> {
    return this.http.delete(`http://${HOST}/speciality/del/${id}`).map((resp: Response) => resp.json());
  }

  edit(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`http://${HOST}/speciality/update/${speciality['speciality_id']}`, JSON.stringify(speciality))
      .map((resp: Response) => resp.json());
  }

  save(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`http://${HOST}/speciality/insertData`, JSON.stringify(speciality))
      .map((resp: Response) => resp.json());
  }
}
