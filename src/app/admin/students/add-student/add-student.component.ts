import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Student } from '../student';
import { AddEditDeleteService } from '../add-edit-delete.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
  providers: [AddEditDeleteService]
})
export class AddStudentComponent implements OnInit {
  student: Student = new Student();
  studentName: FormControl;
  studentSurname: FormControl;
  studentFname: FormControl;
  studentPassword: FormControl;
  studentPasswordConfirm: FormControl;
  studentForm: FormGroup;
  studentEmail: string;
  studentGradebookId: string;
  studentUsername: string;
  studentPhoto: any;
  studentGroupId: number;
  studentPlainPassword: string;

  constructor(private modal: MdDialogRef<any>, private http: AddEditDeleteService) {}

  ngOnInit() {
    this.studentName = new FormControl('');
    this.studentSurname = new FormControl('');
    this.studentFname = new FormControl('');
    this.studentPassword = new FormControl('');
    this.studentPasswordConfirm = new FormControl('');
    this.studentForm = new FormGroup({
      'name': this.studentName,
      'surname': this.studentSurname,
      'f_name': this.studentFname,
      'password': this.studentPassword,
      'password_confirm': this.studentPasswordConfirm
    });
  }

  addStudent() {
    this.http.insert(
      this.studentUsername = 'test' + Math.random(),
      this.studentPassword.value,
      this.studentPasswordConfirm.value,
      this.studentEmail = 'test' + Math.random() + '@mail.if.ua',
      this.studentGradebookId = 'If-1234567',
      this.studentSurname.value,
      this.studentName.value,
      this.studentFname.value,
      this.studentGroupId = 1,
      this.studentPlainPassword = '1qaz2wsx',
      this.studentPhoto = ''
    ).subscribe(resp => {
      this.student.username = '' ;
      this.student.password = '';
      this.student.password_confirm = '';
      this.student.email = '';
      this.student.gradebook_id = '';
      this.student.student_surname = '';
      this.student.student_name = '';
      this.student.student_fname = '';
      this.student.group_id = 1;
      this.student.plain_password = '';
      this.student.photo = '';
    });
  }

  cansel() {
    let cansel = this.modal.close();
  }


}
