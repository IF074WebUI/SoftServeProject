import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HOST} from '../../constants';
import {GetTestsBySubjectService} from 'app/admin/services/get-tests-by-subject.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Question} from './test-player.component';
import {Answer} from '../../admin/answers/answer';


@Injectable()
export class TestPlayerService {
 private questions: Question[] = [];
 private answers: Answer[] = [];

  constructor(private http: Http, private getTestBySubjectService: GetTestsBySubjectService) {
  }

  getTestDetatilBuTest(id: number) {
    return this.getTestBySubjectService.getTestsBySubject(id);
  }
  getCurrentTime() {
    return this.http.get('http://' + HOST + '/TestPlayer/getTimeStamp').map(resp => resp.json());
  }

  getQuestionsByLevelRandom(test_id: number, level: number, number: number) {
    return this.http.get('http://' + HOST + '/question/getQuestionsByLevelRand/' + test_id + '/' + level + '/' + number).map(resp => resp.json());
  }
  getTestDetail(test_id: number){
    return this.http.get('http://' + HOST + '/testDetail/getTestDetailsByTest/' + test_id).map(resp => resp.json());
  }
  getAnswersById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/SAnswer/getAnswersByQuestion/' + id).map(resp => resp.json());
  }

  getQuestions = (testDetails: any[], i: number) => {
    this.questions = [];
    let forkJoinBatch: Observable<any>[] = testDetails.map(item => {
      return this.getQuestionsByLevelRandom(item.test_id, item.level, item.tasks);
    });
    return Observable.forkJoin(forkJoinBatch)
      .map((questions: Question[][] | any) => {
        // let error = questions.some((item) => {
        //   return item.response;
        // });
        // if (error) {
        //   throw new Error("test data are absent");
        // }
        this.questions = this.prepareQuestionForTest(<Question[][]>questions, testDetails);
        return this.questions;
      });

  };

  prepareQuestionForTest(questions: Question[][], testDetails: any[]): Question[] {
    let tempArr: Question[] = [];

    questions.forEach((elem: Question[]) => {
      tempArr.push(...elem);
    });
    return tempArr.map((question: Question) =>  {return question;})
  }

  getAnswers = (questions: Question[]) => {
    let forkJoinBatch: Observable<any>[] = questions.map(question => {
      return this.getAnswersById(question['question_id']);
    });
    return Observable.forkJoin(forkJoinBatch)
      .do((answers: Answer[][] | any) => {
        let error = questions.some((item) => {
          return item['response'];
        });
        if (error) {
          throw new Error("test data are absent");
        }
        answers.forEach((answer, i) => {questions[i]['answers'] = answer; })
      });

  }
}


