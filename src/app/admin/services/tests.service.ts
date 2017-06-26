import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HOST} from '../../constants';
import 'rxjs/add/operator/map';
import {Subject} from "../subject/subject";
import {ResultsService} from "./results.service";
import {QuestionsService} from "./questions.service";
import {TestDetailService} from "../test-detail/test-detail.service";
import {DeleteRecordByIdService} from "./delete-record-by-id.service";

@Injectable()
export class TestsService {
  constructor(private http: Http, private resultsService: ResultsService, private questionsService: QuestionsService,
              private testDetailsService: TestDetailService, private deleteRecordByIdService: DeleteRecordByIdService) {
  }

  getTestById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/test/getRecords/' + id).map(resp => resp.json());
  }

  getTestsBySubject(id: number): Observable<Subject[]> {
    return this.http.get('http://' + HOST + '/test/getTestsBySubject/' + id).map(resp => resp.json());
  }

  deleteCascade(id: number): Observable<any> {
    let delResultsQuestionsTDObs = [];
    return Observable.forkJoin(
      this.resultsService.getAllByTestGroupDate(id),
      this.questionsService.getRecordsRangeByTest(id, 50, 0),
      this.testDetailsService.getTestDetails(id))
      .flatMap(resp => {
        if (resp[0]['response'] === 'no records' && resp[1]['response'] === 'no records' && resp[2]['response'] === 'no records') {
          return Observable.forkJoin(Observable.of(1));
        } else {
          for (let result of resp[0]) {
            delResultsQuestionsTDObs.push(this.resultsService.delete(result.session_id));
          }
          for (let question of resp[1]) {
            delResultsQuestionsTDObs.push(this.questionsService.deleteCascade(question.question_id));
          }
          for (let testDetail of resp[2]) {
            delResultsQuestionsTDObs.push(this.testDetailsService.deleteDetail(testDetail.id));
          }
          return Observable.forkJoin(...delResultsQuestionsTDObs);
        }
      }).flatMap(arr => {
        return this.deleteRecordByIdService.deleteRecordsById('test', id)
      });
  }

  getAll(): Observable<any> {
    return this.http.get('http://' + HOST + '/test/getRecords').map(resp => resp.json());
  }

  createTest(newTest): Observable<Response> {
    const bodyForSendingNewTest = JSON.stringify({
      test_name: newTest.test_name,
      tasks: newTest.tasks,
      time_for_test: newTest.time_for_test,
      enabled: newTest.enabled,
      attempts: newTest.attempts,
      subject_id: newTest.subject_id
    });
    return this.http.post('http://' + HOST + '/test/insertData', bodyForSendingNewTest)
      .map((resp) => resp.json());
  }

  updateTest(updateTest, updateTestId): Observable<Response> {
    const bodyForSendingUpdateTest = JSON.stringify({
      test_name: updateTest.test_name,
      tasks: updateTest.tasks,
      time_for_test: updateTest.time_for_test,
      enabled: updateTest.enabled,
      attempts: updateTest.attempts,
      subject_id: updateTest.subject_id
    });
    return this.http.post('http://' + HOST + '/test/update/' + updateTestId, bodyForSendingUpdateTest)
      .map((resp) => resp.json());
  }
}
