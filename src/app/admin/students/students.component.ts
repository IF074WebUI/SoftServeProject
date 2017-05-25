import { Component, OnInit } from '@angular/core';
import { StudentsService} from './students.service';
import { Router } from '@angular/router';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import { AddEditDeleteService } from './add-edit-delete.service';
import {FormControl, FormGroup} from '@angular/forms';
import { Student } from './student';
import { NgbModal } from  '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [AddEditDeleteService]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  page = 1;
  count: number;
  countPerPage = 10;
  studentForEdit: Student;
  studentForDelete: Student;
  selectedStudent: Student;
  // add form
  studentForm: FormGroup;
  studentName: FormControl;
  studentSurname: FormControl;
  studentFname: FormControl;
  studentPassword: FormControl;
  studentPasswordConfirm: FormControl;
  studentEmail: string;
  studentGradebookId: string;
  studentUsername: string;
  studentPhoto: any;
  studentGroupId: number;
  studentPlainPassword: string;
  // edit form
  studentEditForm: FormGroup;
  studentEditName: FormControl;
  studentEditSurname: FormControl;
  studentEditFname: FormControl;
  studentEditPassword: string;
  studentEditPasswordConfirm: string;
  studentEditEmail: string;
  studentEditGradebookId: string;
  studentEditUsername: string;
  studentEditPhoto: any;
  studentEditGroupId: number;
  studentEditPlainPassword: string;

  studentUser_id: FormControl;

  constructor(private dialog: NgbModal, private studentsService: StudentsService, private router: Router, private http: AddEditDeleteService) {
  }

  ngOnInit() {
    this.studentsService.getAllStudents().subscribe((data) => {
      this.students = data;
    });
    this.getStudents();
    this.getCount();

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

    this.studentEditName = new FormControl('');
    this.studentEditSurname = new FormControl('');
    this.studentEditFname = new FormControl('');
    this.studentEditForm = new FormGroup({
      'editName': this.studentEditName,
      'editSurname': this.studentEditSurname,
      'editF_name': this.studentEditFname
    });
  }

  onSelect(student: Student) {
    this.selectedStudent = student;
    this.studentForDelete = student;
    this.studentForEdit = student;
  }

  getStudents(): void {
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.studentsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => this.students = resp, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.studentsService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number) {
    this.page = page;
    this.getStudents();
  }

  changeCountPerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getStudents();
  }


  addStudent() {
    this.http.insert(
      this.studentUsername = 'test' + Math.random(),
      this.studentPassword.value,
      this.studentPasswordConfirm.value,
      this.studentEmail = 'test' + Math.random() + '@mail.if.ua',
      this.studentGradebookId = 'If-12' + Math.random().toFixed(4),
      this.studentSurname.value,
      this.studentName.value,
      this.studentFname.value,
      this.studentGroupId = 1,
      this.studentPlainPassword = '1qaz2wsx',
      this.studentPhoto = ''
    ).subscribe((resp) => {
      this.getCount();
      this.getStudents();
    }, (error) => this.router.navigate(['/bad_request'])
    );
  }

  addDialog(addForm) {
    this.studentPassword.reset();
    this.studentPasswordConfirm.reset();
    this.studentSurname.reset();
    this.studentName.reset();
    this.studentFname.reset();
    this.dialog.open(addForm).result.then((result) => {
      this.addStudent();
    }, (reason) => {
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
    ).subscribe((resp) => {
      this.getStudents();
    }, (error) => this.router.navigate(['/bad_request'])
    );
  }

  editDialog(editForm) {
    this.dialog.open(editForm).result.then((result) => {
      this.editStudent();
    }, (reason) => {
    });
  }
}
