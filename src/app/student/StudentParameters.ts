/**
 * Created by mykola on 7/1/17.
 */
import { Student } from '../admin/students/student';
import { Group } from '../admin/group/group';
import { Subject } from '../admin/subject/subject';
import { Test } from '../admin/tests/test';
export interface StudentParameters {
  student: Student;
  groupId: number;
  subject: Subject[];
  tests: Test[];
};
