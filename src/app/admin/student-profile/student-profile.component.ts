import { Component, OnInit, Input } from '@angular/core';
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
  groups: Group[];
  user_id: number;
  student: Student;
  AdminUser: Student;
  studentForEdit: Student;
  studentEditForm: FormGroup;
  studentForEdit_name: FormControl;
  studentForEdit_surname: FormControl;
  studentForEdit_fname: FormControl;
  studentForEdit_group_id: FormControl;
  studentForEdit_username: FormControl;
  studentForEdit_password: FormControl;
  studentForEdit_email: FormControl;
  studentForEdit_gradebook_id: FormControl;
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

    this.studentForEdit_name = new FormControl('');
    this.studentForEdit_surname = new FormControl('');
    this.studentForEdit_fname = new FormControl('');
    this.studentForEdit_group_id = new FormControl('');
    this.studentForEdit_username = new FormControl('');
    this.studentForEdit_password = new FormControl('');
    this.studentForEdit_email = new FormControl('');
    this.studentForEdit_gradebook_id = new FormControl('');

    this.studentEditForm = new FormGroup({
      'group_id': this.studentForEdit_group_id,
      'student_surname': this.studentForEdit_surname,
      'student_name': this.studentForEdit_name,
      'student_fname': this.studentForEdit_fname,
      'gradebook_id': this.studentForEdit_gradebook_id,
      'username': this.studentForEdit_username,
      'password': this.studentForEdit_password,
      'email': this.studentForEdit_email
    });

    this.studentEditData = {
      'password_confirm' : this.studentForEdit_password,
      'plain_password': this.studentForEdit_password,
      'photo': ''
    };
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
     console.log(this.studentForEdit.username);
     this.studentForEdit_group_id.setValue(this.studentForEdit['group_id']);
     this.studentForEdit_name.setValue(this.studentForEdit['student_name']);
     this.studentForEdit_surname.setValue(this.studentForEdit['student_surname']);
     this.studentForEdit_fname.setValue(this.studentForEdit['student_fname']);
     this.studentForEdit_gradebook_id.setValue(this.studentForEdit['gradebook_id']);
     this.studentForEdit_username.setValue(this.studentForEdit['username']);
     this.studentForEdit_password.setValue(this.studentForEdit['plain_password']);
     this.studentForEdit_email.setValue(this.studentForEdit['email']);
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

  editStudent(editForm) {
    this.studentsService.update(editForm.value, this.studentEditData, this.user_id).subscribe(resp => {
      this.getStudent();
    });
  }


  // getStudentEmail(data) {
  //   this.studentForEdit = data;
  //   this.getRecordsByIdService.getRecordsById('AdminUser', this.user_id).subscribe(resp => this.student.email = resp[0].email);
  // }
  //
  // getStudentUsername(data) {
  //   this.studentForEdit = data;
  //   this.getRecordsByIdService.getRecordsById('AdminUser', this.user_id).subscribe(resp => this.student.username = resp[0].username);
  // }

  // edit(student) {
  //   this.studentForEdit = student;
  //   console.log(student);
  //   this.getStudentUsername(student);
  //   this.getStudentEmail(student);
  //   if (this.student.email) {
  //     this.popup.sendItem(
  //       {
  //         student_name: this.studentForEdit.student_name,
  //         student_surname: this.studentForEdit.student_surname,
  //         student_fname: this.studentForEdit.student_fname,
  //         gradebook: this.studentForEdit.gradebook_id,
  //         email: this.studentForEdit.email,
  //         group: this.studentForEdit.group_name,
  //         group_id: this.studentForEdit.group_id,
  //         user_id: this.studentForEdit.user_id
  //       }
  //     );
  //     this.popup.showModal();
  //   }
  // }
}


