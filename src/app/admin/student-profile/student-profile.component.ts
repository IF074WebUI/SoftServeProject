import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../students/student';
import { StudentsService } from '../students/students.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {FacultyService} from "../faculties/faculty.service";
import { FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  providers: [StudentsService, FacultyService]
})
export class StudentProfileComponent implements OnInit {
  user_id;
  student: Student;
  AdminUser;
  studentEditForm: FormGroup;
  studentEditData = {};

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;

  constructor(private studentsService: StudentsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(resp => this.user_id = resp['user_id']);
    this.getStudent();
    this.getAdminUser();

    this.studentEditForm = new FormGroup({
      'group_id': new FormControl(''),
      'student_surname': new FormControl(''),
      'student_name': new FormControl(''),
      'student_fname': new FormControl('')
    });

    this.studentEditData = {
        'username' : 'test' + Math.random(),
        'password' : '1qaz2wsx',
        'password_confirm': '1qaz2wsx',
        'email' : '' + Math.random() + '@mail.if.ua',
        'gradebook_id' : '' + Math.random().toFixed(10),
        'plain_password' : '' + Math.random(),
        'photo' : ''
      };
    }

  getStudent() {
    this.studentsService.getStudentById(this.user_id).subscribe((resp: Student) => {
     this.student = resp[0];
      console.log(this.student);
   });
   };

  getAdminUser() {
    this.studentsService.getAdminUser(this.user_id).subscribe(resp => {
      this.AdminUser = resp[0];
      console.log(this.AdminUser);
    });
  }

  // edit(student: Student) {
  //   this.popup.sendItem(student);
  //   this.popup.showModal();
  // }
  //
  // formSubmitted(value) {
  //   console.log(value);}
}


