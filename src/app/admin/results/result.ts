export interface Result {
  session_id: number;
  student_id: number;
  test_id: number;
  session_date: Date;
  start_time: Date;
  end_time: Date;
  result: number;
  questions: string;
  true_answers: string;
  answers: string;
  student_name?: string;
  test_name?: string;
}
