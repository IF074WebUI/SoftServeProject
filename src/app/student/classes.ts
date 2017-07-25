
import {Answer} from '../admin/answers/answer';

export class CheckAnswers {
  question_id: number;
  answer_ids: Array<number>;

  constructor(question_id, answer_ids) {
    this.question_id = question_id;
    this.answer_ids = answer_ids;
  }
}

export class InitialRezults {
  number_of_true_answers: number;
  number_of_all_answers: number;
  full_mark: number;
  max_mark: number;
  test_name: string;

  constructor(full_mark, number_of_true_answers, max_mark, number_of_all_answers, test_name) {
    this.full_mark = full_mark;
    this.number_of_true_answers = number_of_true_answers;
    this.max_mark = max_mark;
    this.number_of_all_answers = number_of_all_answers;
    this.test_name = test_name;
  }
}

export class Question {
  question_id: number;
  test_id: string;
  question_text: string;
  level: string;
  type: string;
  attachment?: any;
  answers: Answer[];
  true_answer: boolean;
}
