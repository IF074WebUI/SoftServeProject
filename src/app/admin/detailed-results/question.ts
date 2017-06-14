import { Answer } from './answer';
export interface Question {
  question_id: number;
  test_id: number;
  question_text: string;
  level: number;
  type: number;
  attachment: string;
  answers: Answer[];
  true_answer: boolean;
}
