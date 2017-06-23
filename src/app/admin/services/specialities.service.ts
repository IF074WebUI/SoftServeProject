import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Speciality } from '../specialities/speciality';
import { SPECIALITY_URI } from '../../constants';
import { Router } from '@angular/router';
import { GroupService } from '../group/group.service';
import { Group } from '../group/group';

@Injectable()
export class SpecialitiesService {

  options: RequestOptions;


  constructor(private http: Http, private router: Router, private groupsService: GroupService) {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers});
  }

  getAll(): Observable<Speciality[]> {
    return this.http.get(`${SPECIALITY_URI}getRecords`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

  getPaginated(limit: number, offset: number): Observable<Speciality[]> {
  return this.http.get(`${SPECIALITY_URI}getRecordsRange/${limit}/${offset}`).map((resp: Response) => resp.json())
    .catch(this.handleError.bind(this));
  }

  searchByName(criteria: string): Observable<Speciality[]> {
    return this.http.get(`${SPECIALITY_URI}getRecordsBySearch/${criteria}`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

  getCount(): Observable<number> {
    return this.http.get(`${SPECIALITY_URI}countRecords`).map((resp: Response) => resp.json()['numberOfRecords'])
      .catch(this.handleError.bind(this));
  }

  delete(id: number): Observable<Speciality> {
    return this.http.delete(`${SPECIALITY_URI}del/${id}`).map((resp: Response) => resp.json())
      .catch(this.handleError.bind(this));
  }

 deleteCascade(id: number): Observable<any> {
   let delGroupsObs = [];
   return this.groupsService.getGroupsBySpeciality(id).flatMap((groups: Group[]) => {
     if (groups['response'] === 'no records') {
       return Observable.forkJoin(Observable.of(1));
     } else {
       for (let group of groups) {
         delGroupsObs.push(this.groupsService.deleteCascade(group.group_id));
       }
       return Observable.forkJoin(...delGroupsObs);
     }
   }).flatMap(arr =>
     this.delete(id)
   );
 }

  edit(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`${SPECIALITY_URI}update/${speciality['speciality_id']}`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json()).catch(this.handleError.bind(this));
  }

  save(speciality: Speciality): Observable<Speciality> {
    return this.http.post(`${SPECIALITY_URI}insertData`, JSON.stringify(speciality), this.options)
      .map((resp: Response) => resp.json()).catch(this.handleError.bind(this));
  }

  handleError (error: Response|any) {
    if (error.status === 400) {
      this.router.navigate(['/bad_request']);
    } else if (error.status === 403) {
      this.router.navigate(['/denied']);
    } else if (error.status === 404) {
      this.router.navigate(['/not_found']);
    }
    return Observable.throw(new Error(error));
  }
}
