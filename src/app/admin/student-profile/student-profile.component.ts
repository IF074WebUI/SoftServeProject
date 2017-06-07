import { Component, OnInit } from '@angular/core';
import { Student } from '../students/student';
import { StudentsService } from '../students/students.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  providers: [StudentsService]
})
export class StudentProfileComponent implements OnInit {
  user_id;
  student: Student;

  constructor(private studentsService: StudentsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(resp => this.user_id = resp['user_id']);
    this.getStudent();
  }

  getStudent() {
    this.studentsService.getStudentById(this.user_id).subscribe((resp: Student) => {
     this.student = resp[0];
      console.log(this.student);
   });
   };
}

