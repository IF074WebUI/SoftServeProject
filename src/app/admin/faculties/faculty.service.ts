import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HOST } from '../../constants';

@Injectable()
export class FacultyService {

  constructor(private http: Http) {
  }

  getAllFaculties() {
    return this.http.get('http://' + HOST + '/Faculty/getRecords').map((resp: Response) => resp.json());
  }

  countAllRecords() {
    return this.http.get('http://' + HOST + '/Faculty/countRecords').map((resp: Response) => resp.json());
  }

  getPaginatedPage(perpage: number, position: number) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsRange/' +  perpage + '/'+ position).map((resp: Response) => resp.json());
  }

  deleteItem(id: number) {
    return this.http.delete('http://' + HOST + '/Faculty/del/' + id).map((resp: Response) => resp.json()).catch(this.handleError);

  }

  editItem(id: number, name: string, description: string): Observable<Response> {
    let body = JSON.stringify({'faculty_name': name, 'faculty_description': description});
    return this.http.post('http://' + HOST + '/Faculty/update/' + id, body).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  addItem(name: string, description: string): Observable<Response> {
    let body = JSON.stringify({'faculty_name': name, 'faculty_description': description});
    return this.http.post('http://' + HOST + '/Faculty/insertData', body).map((resp: Response) => resp.json()).catch(this.handleError);
  }

  searchByName(name: string) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsBySearch/' + name).map((resp: Response) => resp.json());
  }

  getFacultyById(id: number) {
    return this.http.get('http://' + HOST + '/Faculty/getRecords/' + id).map((resp: Response) => resp.json());
  }

  searchFaculty(text: string) {
    return this.http.get('http://' + HOST + '/Faculty/getRecordsBySearch/' + text).map((resp: Response) => resp.json());
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

