import {Question} from '../questions/question';
import {Answer} from '../answers/answer';
export interface Result {
  session_id: number;
  student_id: number;
  test_id: number;
  session_date: Date;
  start_time: Date;
  end_time: Date;
  result: number;
  questions: Question[];
  true_answers: string;
  answers: Answer[];
  student_name?: string;
  test_name?: string;
}
