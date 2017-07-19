import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {HOST} from '../../constants';
import {Observable} from 'rxjs/Observable';
import {Question} from '../questions/question';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {AnswersService} from "./answers.service";
import {Answer} from "../answers/answer";

@Injectable()
export class QuestionsService {
  questions: Question[] = [];

  constructor(private http: Http, private answersService: AnswersService) {}

  getQuestionById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/question/getRecords/' + id).map(resp => resp.json());
  }

  getQuestions() {
    return this.http.get('http://' + HOST + '/question/getRecords')
      .map((resp: Response) => resp.json());
  }

  getPaginatedPage(pageNumber: number, offset: number) {
    return this.http.get('http://' + HOST + '/question/getRecordsRange/' + offset + '/' + (pageNumber - 1) * offset )
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

  deleteCascade(id: number): Observable<any> {
    let delAnswersObs = [];
    return this.answersService.getAnswersByQuestion(id).flatMap((answers: Answer[]) => {
      if (answers['response'] === 'no records') {
        return Observable.forkJoin(Observable.of(1));
      } else {
        for (let answer of answers) {
          delAnswersObs.push(this.answersService.deleteAnswer(answer.answer_id));
        }
        return Observable.forkJoin(...delAnswersObs);
      }
    }).flatMap(arr =>
      this.deleteQuestion(id)
    );
  }

  editQuestion(question_id: number, questiontext: string, testId: number, level: number, type: number, attach: any) {
    const bodyForSendingEditedQuestions = JSON.stringify({question_text: questiontext, test_id: testId,
      level: level, type: type, attachment: attach});
    return this.http.post('http://' + HOST + '/question/update/' + question_id, bodyForSendingEditedQuestions)
      .map((resp) => resp.json());
  }

  getCountQuestions(test_id: number) {
    return this.http.get( 'http://' + HOST + '/question/countRecordsByTest/' + test_id)
      .map((resp: Response) => resp.json()['numberOfRecords']);
  }

  searchByName(criteria: string): Observable<Question[]> {
    return this.http.get('http://' + HOST + '/question/getRecordsBySearch/' + criteria).map((resp: Response) => resp.json());
  }
  getQuestionsByLevelRand(testId: number, level: number, number: number): Observable <any> {
    return this.http.get('http://' + HOST + '/question/getQuestionsByLevelRand/' + testId + '/' + level + '/' + number)
      .map((resp: Response) => resp.json());
}
  getRecordsRangeByTest(test_id: number, limit: number, offset: number) {
    return this.http.get('http://' + HOST + '/question/getRecordsRangeByTest/' + test_id + '/' + limit + '/' + offset)
      .map((resp: Response) => resp.json());
}

}
