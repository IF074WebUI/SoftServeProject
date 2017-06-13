import {HOST} from "../../constants";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AnswersService {

  constructor(private http: Http) {
  }

  getAnswersById(id: number): Observable<any> {
    return this.http.get('http://' + HOST + '/answer/getRecords/' + id).map(resp => resp.json());
  }

  createAnswer(newAnswer) {
    const bodyForSendingNewTimeTable = JSON.stringify({
      answer_text: newAnswer.answer_text,
      attachment: newAnswer.attachment,
      true_answer: newAnswer.true_answer
    });
    // return this.http.post('http://' + HOST + '/answer/insertData', bodyForSendingNewTimeTable)
    //   .map((resp: Response) => resp.json());
  }

  updateAnswer(updatedAnswer) {
    const bodyForSendingNewTimeTable = JSON.stringify({
      answer_text: updatedAnswer.answer_text,
      attachment: updatedAnswer.attachment,
      true_answer: updatedAnswer.true_answer
    });
  }
}
  //   return this.http.post('http://' + HOST + '/timeTable/update/' + updatedAnswer.answer_id, bodyForSendingNewTimeTable)
  //     .map((resp: Response) => resp.json());
  // }

