import { Answer } from '../answers/answer';
export class Question {
  question_id: number;
  test_id: number;
  question_text: string;
  level: number;
  type: number;
  attachment: any;
  answers: Answer[];
  true_answer: boolean;
  // constructor(text: string) {
  //   this.question_text = text;
  // }
}
