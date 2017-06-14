import { Component, OnInit } from '@angular/core';
import { Student } from '../students/student';
import { StudentsService } from '../students/students.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Group } from '../group/group';
import {GetAllRecordsService} from '../services/get-all-records.service';

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  providers: [StudentsService, GetRecordsByIdService, GetAllRecordsService]
})
export class StudentProfileComponent implements OnInit {
  MODAL_REQUIRED = 'Поле обов\'язкове до заповнення';
  groups: Group[];
  user_id: number;
  student: Student;
  AdminUser: Student;
  studentForEdit: Student;
  studentEditForm: FormGroup;
  studentForEdit_password: string;
  studentEditData = {};

  constructor(private studentsService: StudentsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(resp => this.user_id = resp['user_id']);
    this.getStudent();
    this.getAdminUser();
    this.getGroups();

    this.studentEditForm = new FormGroup({
      'group_id': new FormControl(''),
      'student_surname': new FormControl('', Validators.required),
      'student_name': new FormControl('', Validators.required),
      'student_fname': new FormControl('', Validators.required),
      'gradebook_id': new FormControl('', Validators.required),
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required)
    });
  }

  getStudent() {
    this.studentsService.getStudentById(this.user_id).subscribe((resp: Student) => {
     this.getStudentsWithGroupName(resp[0]);
   });
   }

   selectedStudent(student: Student, AdminUser) {
    this.studentForEdit = student;
    this.studentForEdit.username = AdminUser.username;
    this.studentForEdit.email = AdminUser.email;
    this.studentEditForm.setValue({
      group_id: this.studentForEdit.group_id,
      student_name: this.studentForEdit.student_name,
      student_surname: this.studentForEdit.student_surname,
      student_fname: this.studentForEdit.student_fname,
      gradebook_id: this.studentForEdit.gradebook_id,
      username: this.studentForEdit.username,
      password: this.studentForEdit.plain_password,
      email: this.studentForEdit.email
     });
   }

  getAdminUser() {
    this.studentsService.getAdminUser(this.user_id).subscribe(resp => {
      this.AdminUser = resp[0];
    });
  }

  goToStudentResult() {
    this.router.navigate(['./results', this.user_id], {relativeTo: this.activatedRoute.parent});
  }

  getGroups() {
    this.getAllRecordsService.getAllRecords('group').subscribe((data) => {
      this.groups = data;
    });
  }

  getStudentsWithGroupName(data) {
    this.student = data;
    this.getRecordsByIdService.getRecordsById('group', this.student.group_id).subscribe((StudentData) => {
      this.student.group_name = StudentData[0].group_name;
    });
  }

  editStudent() {
    this.studentEditData = {
      'password_confirm' : this.studentForEdit_password,
      'plain_password': this.studentForEdit_password,
      'photo': ''
    };
    this.studentsService.update(this.studentEditForm.value, this.studentEditData, this.user_id).subscribe(resp => {
      this.getStudent();
      this.getAdminUser();
    });
  }
}


