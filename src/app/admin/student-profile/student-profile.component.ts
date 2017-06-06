import { Component, OnInit } from '@angular/core';
import { Student } from '../students/student';
import { StudentsService } from '../students/students.service';

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  providers: [StudentsService]
})
export class StudentProfileComponent implements OnInit {
  student: Student;

  constructor(private studentsService: StudentsService) { }

  ngOnInit() {
    this.getStudent();
  }

  getStudent() {
    this.studentsService.getStudentById(115).subscribe((resp: Student) => {
      console.log(resp);
      this.student = resp;
      console.log(this.student);
    });
  };
}

