import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {HOST} from "../../constants";
import {Observable} from "rxjs/Observable";
import {Question} from "../questions/question";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class QuestionsService {
  questions: Question[] = [];

  constructor(private http: Http) {}

  getQuestionById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/question/getRecords/' + id).map(resp => resp.json());
  }

  getQuestions() {
    return this.http.get('http://' + HOST + '/question/getRecords')
      .map((resp: Response) => resp.json());
  }

  getPaginatedPage(pageNumber: number, recordsPerPage: number) {
    return this.http.get('http://' + HOST + '/question/getRecordsRange/' + recordsPerPage + '/' + (pageNumber - 1) * recordsPerPage )
      .map((resp: Response) => resp.json());
  }
  getTests() {
    return this.http.get('http://' + HOST + '/test/getRecords')
      .map((resp: Response) => resp.json());
  }
  getAnswers() {
    return this.http.get('http://' + HOST + '/answer/getRecords')
      .map((resp: Response) => resp.json());
  }
  createQuestion(questiontext: string, testId: number ): Observable<Response> {
    const bodyForSendingNewQuestions = JSON.stringify({question_text: questiontext, test_id: testId});
    return this.http.post('http://' + HOST + '/question/insertData', bodyForSendingNewQuestions)
      .map((resp: Response) => resp.json());
  }
  deleteQuestion(id: number) {
    return this.http.delete('http://' + HOST + '/question/del/' + id)
      .map((resp: Response) => resp.json());
  }

  // METHOD FOR THE FUTURE
  // deleteGroupsBySpeciality(specialityId: number): Observable<any> {
  //   return this.http.get('http://' + HOST + GROUP_ENITY + '/getGroupsBySpeciality/' + specialityId)
  //     .map((resp: Response) => <Group[]>resp.json())
  //     .map((data: Group[]) => {
  //     data.map((g: Group) => {
  //       this.deleteGroup(g.group_id).subscribe(r => console.log(r)); }); });
  // }


  editQuestion(id: number, questiontext: string, testId: number) {
    const bodyForSendingEditedQuestions = JSON.stringify({question_text: questiontext, test_id: testId});
    return this.http.post('http://' + HOST + '/question/update/' + id, bodyForSendingEditedQuestions)
      .map((resp) => resp.json());
  }

  getCountQuestions() {
    return this.http.get( 'http://' + HOST + '/question/countRecords')
      .map((resp: Response) => resp.json()['numberOfRecords']);
  }
  getQuestionsByTest(test_id: number) {
    return this.http.get('http://' + HOST + + '/question/getRecordsRangeByTest/' + test_id)
      .map((resp: Response) => resp.json());
  }

  // getQuestionsByLevel(level: number) {
  //   return this.http.get('http://' + HOST + '/question/getQuestionsByLevelRand/' + level)
  //     .map((resp: Response) => resp.json());
  // }

  searchByName(criteria: string): Observable<Question[]> {
    return this.http.get('http://' + HOST + '/question/getRecordsBySearch/' + criteria).map((resp: Response) => resp.json());
  }

}
