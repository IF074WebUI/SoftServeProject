import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HOST} from '../../constants';
import {GetTestsBySubjectService} from 'app/admin/services/get-tests-by-subject.service';

@Injectable()
export class TestPlayerService {

  constructor(private http: Http, private getTestBySubjectService: GetTestsBySubjectService) {
  }

  getTestDetatilBuTest(id: number) {
    return this.getTestBySubjectService.getTestsBySubject(id);
  }

  getQuestionsByLevelRandom(test_id: number, level: number, number: number) {
    return this.http.get('http://' + HOST + '/question/getQuestionsByLevelRand/' + test_id + '/' + level + '/' + number).map(resp => resp.json());
  }
  getTestDetail(test_id: number){
    return this.http.get('http://' + HOST + '/testDetail/getTestDetailsByTest/' + test_id).map(resp => resp.json());
  }

}


