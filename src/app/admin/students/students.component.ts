import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import {AddEditDeleteService} from './add-edit-delete.service';
import {FormControl} from '@angular/forms';
import {Student} from './student';

@Component({
  selector: 'app-test',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [AddEditDeleteService]
})
export class StudentsComponent implements OnInit {
  student: Student = new Student();
  studentUser_id: FormControl;
  studentForEdit: Student;
  studentForDel: Student;

  constructor(private dialog: MdDialog) {}

  ngOnInit() {};

  selectedStudent(student: Student) {
    this.studentForEdit = student;
    this.studentForDel = student;
  }

  addDialog() {
    let add = this.dialog.open(AddStudentComponent, {
      width: '50%'
    });
  }

  editDialog() {
    // this.studentUser_id.setValue(this.studentForEdit['user_id']);
    let edit = this.dialog.open(EditStudentComponent, {
      width: '50%'
    });
  }

  deleteDialog() {
    let del = this.dialog.open(DeleteStudentComponent, {
      width: '40%'
    });
  }
}
