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

  delete(id: number): Observable<Speciality> {
    return this.http.delete(`http://${HOST}/speciality/del/${id}`).map((resp: Response) => resp.json());
  }

  edit(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`http://${HOST}/speciality/update/${speciality['speciality_id']}`, JSON.stringify(speciality))
      .map((resp: Response) => resp.json());
  }
}
