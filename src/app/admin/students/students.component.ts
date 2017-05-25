import { Component, OnInit } from '@angular/core';
import { StudentsService} from './students.service';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import { AddEditDeleteService } from './add-edit-delete.service';
import { FormControl } from '@angular/forms';
import { Student } from './student';

@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [AddEditDeleteService]
})
export class StudentsComponent implements OnInit {
  student: Student = new Student();
  studentUser_id: FormControl;
  studentForEdit: Student;
  studentForDel: Student;
  students = [];
  page = 1;
  count: number;
  countPerPage = 10;
  editId = 0;

  constructor(private dialog: MdDialog, private studentsService: StudentsService, private router: Router, private http: AddEditDeleteService) {
  }

  ngOnInit() {
    this.studentsService.getAllStudents().subscribe((data) => {
      this.students = data;
    });
    this.getStudents();
    this.getCount();
  }

  selectedStudent(student: Student) {
    this.studentForEdit = student;
    this.studentForDel = student;
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

  addDialog() {
    const add = this.dialog.open(AddStudentComponent, {
      width: '50%'
    });
  }

  editDialog() {
    const edit = this.dialog.open(EditStudentComponent, {
      width: '50%'
    });
  }

  deleteDialog() {
    const del = this.dialog.open(DeleteStudentComponent, {
      width: '40%'
    });
  }
}
