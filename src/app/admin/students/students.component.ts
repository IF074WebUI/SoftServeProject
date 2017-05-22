import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import {Student} from "./student";
import {AddEditDeleteService} from './add-edit-delete.service';

@Component({
  selector: 'app-test',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: ['AddEditDeleteService']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  page: number = 1;
  count: number;

  constructor(private dialog: MdDialog, private http: AddEditDeleteService) {}

  addDialog() {
    let add = this.dialog.open(AddStudentComponent, {
      width: '50%'
    });
  }

  editDialog() {
    let edit = this.dialog.open(EditStudentComponent);
  }

  deleteDialog() {
    let del = this.dialog.open(DeleteStudentComponent, {
      width: '40%'
    });
  }

  getRecords() {
    this.http.countRecords().subscribe(resp => {
      this.count = resp['numberOfStudent'];
    });
  }

  addStudent() {
    this.http.insert().subscribe(resp => {
      this.getRecords();
      if ( (this.count % 10) === 1) {
        this.page += 1;
      }
    });
  }

  editStudent() {
    this.http.update().subscribe(resp => {

    });
  }

  deleteStudent() {
    this.http.delete().subscribe(resp => {
      this.getRecords();
      if ( (this.count % 10) === 1) {
        this.page -= 1;
      }
    });
  }

  ngOnInit() {};
}
