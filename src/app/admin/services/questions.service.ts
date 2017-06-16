import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {HOST} from '../../constants';
import {Observable} from 'rxjs/Observable';
import {Question} from '../questions/question';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Test} from '../tests/test';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class QuestionsService {
  questions: Question[] = [];
  // private successResponse = (response: Response) => response.json();

  constructor(private http: Http, private router: Router,  private activatedRoute: ActivatedRoute) {}

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
  createQuestion(questiontext: string, testId: number, level: number, type: number, attach: any ): Observable<Response> {
    const bodyForSendingNewQuestions = JSON.stringify({question_text: questiontext, test_id: testId,
      level: level, type: type, attachment: attach});
    return this.http.post('http://' + HOST + '/question/insertData', bodyForSendingNewQuestions)
      .map((resp: Response) => resp.json());
  }
  deleteQuestion(question_id: number) {
    return this.http.delete('http://' + HOST + '/question/del/' + question_id)
      .map((resp: Response) => resp.json());
  }

  editQuestion(question_id: number, questiontext: string, testId: number, level: number, type: number, attach: any) {
    const bodyForSendingEditedQuestions = JSON.stringify({question_text: questiontext, test_id: testId,
      level: level, type: type, attachment: attach});
    return this.http.post('http://' + HOST + '/question/update/' + question_id, bodyForSendingEditedQuestions)
      .map((resp) => resp.json());
  }

  getCountQuestions() {
    return this.http.get( 'http://' + HOST + '/question/countRecords')
      .map((resp: Response) => resp.json()['numberOfRecords']);
  }
  // !!!getQuestionsByTest(test_id: number) {
  //   return this.http.get('http://' + HOST + + '/question/getRecordsRangeByTest/' + test_id)
  //     .map((resp: Response) => resp.json());
  // }

  // getQuestionsByLevel(level: number) {
  //   return this.http.get('http://' + HOST + '/question/getQuestionsByLevelRand/' + level)
  //     .map((resp: Response) => resp.json());
  // }

  searchByName(criteria: string): Observable<Question[]> {
    return this.http.get('http://' + HOST + '/question/getRecordsBySearch/' + criteria).map((resp: Response) => resp.json());
  }
  getQuestionsByLevelRand(testId: number, level: number, number: number): Observable <any> {
    return this.http.get('http://' + HOST + '/question/getQuestionsByLevelRand' + testId + level + number)
      .map((resp: Response) => resp.json());
}
  getRecordsRangeByTest(test_id: number, limit: number, offset: number) {
    return this.http.get('http://' + HOST + '/question/getRecordsRangeByTest' + test_id + limit + offset)
      .map((resp: Response) => resp.json());
}

}
