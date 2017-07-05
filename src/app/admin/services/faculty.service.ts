import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HOST} from '../../constants';
import {GroupService} from '../group/group.service';
import {Group} from '../group/group';

@Injectable()
export class FacultyService {

  constructor(private http: Http, private groupsService: GroupService) {
  }


  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }


  getAllFaculties() {
    return this.http.get('http://' + HOST + '/Faculty/getRecords').map((resp: Response) => resp.json()).catch(this.handleError);
  }

  countAllRecords() {
    return this.http.get('http://' + HOST + '/Faculty/countRecords').map((resp: Response) => resp.json()).catch(this.handleError);
  }

  getPaginatedPage(perpage: number, position: number) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsRange/' + perpage + '/' + position).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  deleteItem(id: number) {
    return this.http.delete('http://' + HOST + '/Faculty/del/' + id).map((resp: Response) => resp.json()).catch(this.handleError);

  }

  deleteCascade(id: number): Observable<any> {
    let delGroupsObs = [];
    return this.groupsService.getGroupsByFaculty(id).flatMap((groups: Group[]) => {
      if (groups['response'] === 'no records') {
        return Observable.forkJoin(Observable.of(1));
      } else {
        for (let group of groups) {
          delGroupsObs.push(this.groupsService.deleteCascade(group.group_id));
        }
        return Observable.forkJoin(...delGroupsObs);
      }
    }).flatMap(arr =>
      this.deleteItem(id)
    );
  }

  editItem(id: number, name: string, description: string): Observable<Response> {
    let body = JSON.stringify({'faculty_name': name, 'faculty_description': description});
    return this.http.post('http://' + HOST + '/Faculty/update/' + id, body).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  addItem(name: string, description: string): Observable<Response> {
    let body = JSON.stringify({'faculty_name': name, 'faculty_description': description});
    return this.http.post('http://' + HOST + '/Faculty/insertData', body).map((resp: Response) => resp.json()).catch(this.handleError.bind(this));
  }

  searchByName(name: string) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsBySearch/' + name).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  getFacultyById(id: number) {
    return this.http.get('http://' + HOST + '/Faculty/getRecords/' + id).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  searchFaculty(text: string) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsBySearch/' + text).map((resp: Response) => resp.json()).catch(this.handleError);
  }

}

