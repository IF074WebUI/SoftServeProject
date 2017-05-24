import {Component, OnInit} from '@angular/core';
import {Student} from '../student';
import {FormControl, FormGroup} from '@angular/forms';
import {AddEditDeleteService} from '../add-edit-delete.service';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css'],
  providers: [AddEditDeleteService]
})
export class EditStudentComponent implements OnInit {
  students: Student[] = [];
  student: Student = new Student();
  studentForEdit = Student;
  studentEditName: FormControl;
  studentEditSurname: FormControl;
  studentEditFname: FormControl;
  studentEditPassword: string;
  studentEditPasswordConfirm: string;
  studentEditForm: FormGroup;
  studentEditEmail: string;
  studentEditGradebookId: string;
  studentEditUsername: string;
  studentEditPhoto: any;
  studentEditGroupId: number;
  studentEditPlainPassword: string;
  studentUser_id: FormControl;

  constructor(private http: AddEditDeleteService, private dialog: MdDialogRef<any>) {
  }

  ngOnInit() {
    this.studentEditName = new FormControl('');
    this.studentEditSurname = new FormControl('');
    this.studentEditFname = new FormControl('');
    this.studentEditForm = new FormGroup({
      'editName': this.studentEditName,
      'editSurname': this.studentEditSurname,
      'editF_name': this.studentEditFname
    });
  }

  editStudent() {
    this.http.update(
      this.studentEditUsername = 'test',
      this.studentEditPassword = '1qaz2wsx',
      this.studentEditPasswordConfirm = '1qaz2wsx',
      this.studentEditEmail = 'test@mail.if.ua',
      this.studentEditGradebookId = '123456798',
      this.studentEditSurname.value,
      this.studentEditName.value,
      this.studentEditFname.value,
      this.studentEditGroupId = 1,
      this.studentEditPlainPassword = '1qaz2wsx',
      this.studentEditPhoto = '',
      this.studentUser_id.value
    ).subscribe(resp => {
      this.student.username = '';
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
    let cansel = this.dialog.close();
  }
}
